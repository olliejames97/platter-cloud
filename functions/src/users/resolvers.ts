// Resolvers in here will be merged with the rest in src/resolvers.ts
import { Resolvers, User } from "../generated/graphql";
import { Context } from "../gqlServer";
import { ApolloError } from "apollo-server-express";
import * as admin from "firebase-admin";
import { rewriteUser } from "./database";
import { DBUser } from "./types";
import * as _ from "lodash";
import { getUserIdFirebase } from "../auth";
export const userResolvers: Resolvers<Context> = {
  Mutation: {
    updateUser: async (_, args, ctx) => {
      console.log("update user " + JSON.stringify(args.data));
      if (!ctx.userToken && !ctx.user?.id) {
        throw new ApolloError(
          "Tried to update user, but no user present in context"
        );
      }
      if (!ctx.userToken) {
        throw new ApolloError("no token");
      }
      const id =
        ctx.user && ctx.user.id
          ? ctx.user.id
          : (await getUserIdFirebase(ctx.userToken)) ?? null;

      if (!id) {
        throw new ApolloError("Couldn't get a user id for update");
      }

      return resolveDbUser(
        await rewriteUser(id, {
          ...args.data,
          username: args.data?.username ?? undefined,
        })
      );
    },
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

      // After this onFirebaseSignup should trigger
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
        hasFullAccount: !!ctx.user.username,
        username: ctx.user.username,
      };
    },
  },
};

export const resolveDbUser = async (user: DBUser): Promise<User> => {
  return {
    id: user.id,
    username: user.username,
    hasFullAccount: user.username ? true : false,
  };
};
