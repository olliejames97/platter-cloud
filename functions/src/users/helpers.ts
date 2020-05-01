import { User } from "../generated/graphql";
import { getUser, writeUser } from "./database";
import { getUserIdFirebase } from "../auth";

export const getUserWithToken = async (token: string): Promise<User | null> => {
  const userId = await getUserIdFirebase(token).catch(() => null);
  return userId ? getUser(userId) : null;
};

export const createUser = async (user: Partial<User> & Pick<User, "id">) => {
  return await writeUser(user);
};
