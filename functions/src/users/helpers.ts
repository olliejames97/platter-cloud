import { User } from "../generated/graphql";
import { writeUser, fetchDbUser } from "./database";
import { getUserIdFirebase } from "../auth";
import { ApolloError } from "apollo-server-express";
import { resolveDbUser } from "./resolvers";

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

export const createUser = async (user: Partial<User> & Pick<User, "id">) => {
  return await writeUser(user);
};
