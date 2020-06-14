import { Resolvers } from "../generated/graphql";
import { Context } from "../gqlServer";
import {
  writeSample,
  getSamplesWithTags,
  dbSampleToSample,
  getLatestSamples,
} from "./database";
import { ApolloError } from "apollo-server-express";
import { getSample } from "./helpers";
import { addSampleToTag } from "../tags/database";
import { uuid } from "uuidv4";
import { addSampleToUser } from "../users/database";
import moment = require("moment");

export const sampleResolvers: Resolvers<Context> = {
  Query: {
    searchSamples: async (_, args, ctx) => {
      console.log("gettings samples with ", args.tags);
      if (!args.tags) {
        throw new ApolloError("No tags");
      }
      const dbSamples = await getSamplesWithTags(args.tags);
      const samples = dbSamples.map(dbSampleToSample);
      return samples;
    },
    home: async (_, __, ___) => {
      const dbSamples = await getLatestSamples();
      const samples = await Promise.all(dbSamples.map(dbSampleToSample));
      return {
        text: "Welcome to Platter",
        samples,
      };
    },
  },
  Mutation: {
    newSample: async (_, args, ctx) => {
      console.log("__new sample", args);
      const url = args.sample?.url;
      const userId = ctx.user?.id || "not set";
      const username = ctx.user?.username || "not set";
      // todo Check URL isvalid
      if (!url || !userId || !username) {
        throw new ApolloError("Missing fields");
      }
      const sampleId = uuid();

      // Get / create necassary tags
      const tagPromises = args.sample?.tagText?.map(async (tagTitle) => {
        console.log("__getting/creating tags tags");
        const result = await addSampleToTag(tagTitle, sampleId);
        if (!result) {
          throw new ApolloError("Error updating/writing a tag to DB");
        }
        return result;
      });

      if (!tagPromises) {
        throw new ApolloError("No tags supplied");
      }
      console.log("__resolving tag promises");
      const tags = await Promise.all(tagPromises);

      // Write sample to database
      console.log("__writing sample to DB");
      const newId = await writeSample(sampleId, {
        url,
        userLink: {
          id: userId,
          title: username,
          type: "user",
        },
        name: args.sample?.name,
        tagLinks: tags.map((t) => ({
          id: t.title,
          type: "tag",
          title: "",
        })),
        downloads: 0,
        createdAt: moment().toDate(),
      });

      // write sample to user
      console.log("adding sample to user");
      addSampleToUser(userId, newId);

      console.log("__got sample ID ", newId);
      console.log("__returning getSample");
      return await getSample(newId);
    },
  },
};
