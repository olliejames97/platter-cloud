import { Resolvers } from "./generated/graphql";
import { userResolvers } from "./users/resolvers";
import _ = require("lodash");

const resolverFunctions: Resolvers = {
  Query: {
    hello: () => "hello",
  },
};

_.merge(resolverFunctions, userResolvers);

export default resolverFunctions as any;
