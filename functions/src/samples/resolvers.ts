import { Resolvers } from "../generated/graphql";
import { Context } from "../gqlServer";
import { writeSample } from "./database";
import { ApolloError } from "apollo-server-express";
import { getSample } from "./helpers";
import { addSampleToTag } from "../tags/database";
import { uuid } from "uuidv4";

export const sampleResolvers: Resolvers<Context> = {
  Mutation: {
    newSample: async (_, args, ctx) => {
      console.log("__new sample", args);
      const url = args.sample?.url;
      const userId = ctx.user?.id || "not set";
      // todo Check URL isvalid
      if (!url || !userId) {
        throw new ApolloError("Missing fields");
      }
      const sampleId = uuid();

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

      console.log("__writing sample to DB");
      const newId = await writeSample(sampleId, {
        url,
        userLink: {
          id: userId,
          type: "user",
        },
        name: args.sample?.name,
        tagLinks: tags.map((t) => ({
          id: t.title,
          type: "tag",
        })),
      });

      console.log("__got sample ID ", newId);
      console.log("__returning getSample");
      return await getSample(newId);
    },
  },
};
