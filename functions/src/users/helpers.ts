import { User } from "../generated/graphql";
import { getUser } from "./database";

export const getUserWithToken = async (token: string): Promise<User | null> => {
  console.log("Getting user data");
  const userId = await getUserIdFirebase(token).catch(() => null);
  if (!userId) {
    console.log("error, no id");
    return null;
  }
  return userId ? await getUser(userId) : null;
};
