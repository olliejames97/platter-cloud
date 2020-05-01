// Resolvers in here will be merged with the rest in src/resolvers.ts
import { Resolvers } from "../generated/graphql";
import { Context } from "../gqlServer";
import { ApolloError } from "apollo-server-express";
import * as admin from "firebase-admin";

export const userResolvers: Resolvers<Context> = {
  Mutation: {
    signUp: async (_, args, ctx) => {
      console.log("user signing up " + args.email);
      if (ctx.user) {
        throw new ApolloError("Tried to sign up a user that already exists");
      }

      const user = await admin
        .auth()
        .createUser({
          email: args.email,
          password: args.password,
        })
        .catch((e) => {
          throw new ApolloError(e);
        });

      return {
        id: user.uid,
        email: user.email,
      };
    },
  },
  Query: {
    me: (_, __, ctx) => {
      if (!ctx.user) {
        throw new ApolloError("No user found");
      }
      return {
        id: ctx.user.id,
        hasFullAccount: false,
        username: "Nyte",
      };
    },
  },
};
