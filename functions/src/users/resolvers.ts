// Resolvers in here will be merged with the rest in src/resolvers.ts
import { Resolvers, User } from "../generated/graphql";
import { Context } from "../gqlServer";
import { ApolloError } from "apollo-server-express";
import * as admin from "firebase-admin";
import { updateUser, getUserWithUsername } from "./database";
import { DBUser } from "./types";
import * as _ from "lodash";
import { getUserIdFirebase } from "../auth";
import { resolveSampleLink } from "../links/links";
export const userResolvers: Resolvers<Context> = {
  Mutation: {
    updateUser: async (_, args, ctx) => {
      if (!args.data || !args.data.username) {
        throw new ApolloError("No data");
      }
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
      const existingUser = await getUserWithUsername(args.data.username);
      if (existingUser) {
        throw new ApolloError("User already exists");
      }
      return resolveDbUser(
        await updateUser(id, {
          ...args.data,
          username: args.data?.username ?? undefined,
        }).catch(() => {
          throw new ApolloError("Couldnt update user");
        })
      );
    },
    signUp: async (_, args, ctx) => {
      console.log("user signing up " + args.email);
      if (ctx.user?.id) {
        throw new ApolloError(
          "Tried to sign up a user that already exists ",
          JSON.stringify(ctx.user, null, 2)
        );
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
        samples: ctx.user.samples,
      };
    },
  },
};

export const resolveDbUser = async (
  user: DBUser,
  withSamples: boolean = true
): Promise<User> => {
  const samples =
    withSamples &&
    user.sampleLinks?.map(async (sl) => await resolveSampleLink(sl));
  return {
    id: user.id,
    username: user.username,
    hasFullAccount: user.username ? true : false,
    samples: samples ? await Promise.all(samples) : undefined,
  };
};
