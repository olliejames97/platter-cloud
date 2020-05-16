import { Resolvers } from "./generated/graphql";
import { userResolvers } from "./users/resolvers";
import _ = require("lodash");
import { Context } from "./gqlServer";
import { sampleResolvers } from "./samples/resolvers";

const resolverFunctions: Resolvers<Context> = {
  Query: {
    hello: (_, __, context) => {
      const me = context.user
        ? context.user
        : context.userToken ?? "no user data in query";
      return "hello " + JSON.stringify(me);
    },
  },
};

_.merge(resolverFunctions, userResolvers, sampleResolvers);

export default resolverFunctions as any;
