// Database abstraction layer
import * as admin from "firebase-admin";
import { DBUser } from "./types";
import { ApolloError } from "apollo-server-express";

const userbase = () => {
  return admin.firestore().collection("users");
};

export const writeUser = async (user: DBUser) => {
  return await userbase().doc(user.id).set(user).catch(console.error);
};

export const fetchDbUser = async (id: string): Promise<DBUser> => {
  const doc = await userbase()
    .doc(id)
    .get()
    .catch(() => {
      throw new ApolloError("Couldn't get user");
    });
  const data = doc.data();
  if (!data || !data.id) {
    throw new ApolloError("Couldn't fetch user");
  }
  return {
    id: data.id,
    username: data?.username ?? undefined,
    sampleIds: [], // TODO!
  };
};

export const updateUser = async (
  id: string,
  data: Partial<Omit<DBUser, "id">>
): Promise<DBUser> => {
  if (!data) {
    throw new ApolloError("No data to rewrite");
  }
  console.log(data);
  await userbase()
    .doc(id)
    .update(data)
    .catch(() => {
      throw new ApolloError("Couldn't rewrite user");
    });
  return await fetchDbUser(id);
};
