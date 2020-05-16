import { Resolvers } from "../generated/graphql";
import { Context } from "../gqlServer";
import { writeSample } from "./database";
import { ApolloError } from "apollo-server-express";
import { getSample } from "./helpers";

export const sampleResolvers: Resolvers<Context> = {
  Mutation: {
    newSample: async (_, args, ctx) => {
      const url = args.sample?.url;
      const userId = ctx.user?.id || "not set";
      // Check URL isvalid
      if (!url || !userId) {
        throw new ApolloError("Missing fields");
      }

      const newId = await writeSample({
        url,
        userLink: {
          id: userId,
          type: "user",
        },
        name: args.sample?.name,
      });

      console.log("got sample ID ", newId);

      return await getSample(newId);
    },
  },
};
