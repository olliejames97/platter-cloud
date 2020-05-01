// Resolvers in here will be merged with the rest in src/resolvers.ts
import { Resolvers } from "../generated/graphql";

export const userResolvers: Resolvers = {
  Mutation: {
    signUp: (ctx, args) => {
      return {
        _id: "test",
        hasFullAccount: false,
        username: "Nyte",
      };
    },
  },
  Query: {
    me: (ctx) => {
      console.log(ctx);
      return {
        _id: "test",
        hasFullAccount: false,
        username: "Nyte",
      };
    },
  },
};
