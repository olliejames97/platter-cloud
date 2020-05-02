import * as express from "express";
import { ApolloServer } from "apollo-server-express";

import schema from "./schema";
import resolvers from "./resolvers";
import { User } from "./generated/graphql";
import { getUserWithToken } from "./users/helpers";
import { initFirebaseAdmin } from "./auth";

export interface Context {
  user: User | null;
  userToken: string | null;
}

const gqlServer = () => {
  console.log("API Starting.");
  initFirebaseAdmin();
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
    introspection: true,
    playground: true,
    context: async ({ req }) => {
      const token = req.headers.authorization ?? null;
      console.log(
        "new request with token: ",
        token ? (token as string).substr(0, 8) : null
      );
      if (!token || token === "no-token" || token === "null") {
        console.log("no token");
        const ctx: Context = { userToken: null, user: null };
        return ctx;
      }
      const restOfUser = await getUserWithToken(token).catch(() => null);

      // add the user to the context, check user gets through to me
      const ctx: Context = { userToken: token, user: restOfUser };
      return ctx;
    },
  });
  apolloServer.applyMiddleware({ app, path: "/", cors: true });
  return app;
};

export default gqlServer;
