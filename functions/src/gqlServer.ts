import * as express from "express";
import { ApolloServer } from "apollo-server-express";

import schema from "./schema";
import resolvers from "./resolvers";
import { User } from "./generated/graphql";
import { getUserWithToken } from "./users/helpers";
import { initFirebaseAdmin } from "./auth";

interface Context {
  user: User | null;
  userToken: string;
}

const gqlServer = () => {
  const app = express();
  initFirebaseAdmin();

  const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
    introspection: true,
    playground: true,
    context: async ({ req }) => {
      const token = req.headers.authorization ?? null;
      if (!token) {
        return null;
      }
      const restOfUser = await getUserWithToken(token);
      // add the user to the context
      const ctx: Context = { userToken: token, user: restOfUser };
      return ctx;
    },
  });
  apolloServer.applyMiddleware({ app, path: "/", cors: true });
  return app;
};

export default gqlServer;
