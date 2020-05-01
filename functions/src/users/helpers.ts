import { User } from "../generated/graphql";
import { getUser } from "./database";
import { getUserIdFirebase } from "../auth";

export const getUserWithToken = async (token: string): Promise<User | null> => {
  const userId = await getUserIdFirebase(token).catch(() => null);
  return userId ? await getUser(userId) : null;
};
