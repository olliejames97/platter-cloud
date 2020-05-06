import { User } from "../generated/graphql";
import { writeUser, fetchDbUser } from "./database";
import { getUserIdFirebase } from "../auth";
import { ApolloError } from "apollo-server-express";
import { resolveDbUser } from "./resolvers";
import { DBUser } from "./types";

export const getUserWithToken = async (token: string): Promise<User | null> => {
  console.log("getting user with token: ", token.substr(0, 10));
  const userId = await getUserIdFirebase(token).catch(() => {
    throw new ApolloError("Couldn't get firebase ID");
  });
  if (!userId) {
    console.log("user has no ID");
    return null;
  }
  const dbUser = await fetchDbUser(userId);

  return userId ? await resolveDbUser(dbUser) : null;
};

export const createUser = async (
  user: Partial<DBUser> & Pick<DBUser, "id">
) => {
  return await writeUser(user);
};

export const getUser = async (id: string) => {
  return await resolveDbUser(await fetchDbUser(id));
};
