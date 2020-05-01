// Database abstraction layer
import * as admin from "firebase-admin";
import { DBUser } from "./types";

export const getUser = (id: string) => null;
const userbase = () => {
  return admin.firestore().collection("users");
};

export const writeUser = async (user: DBUser) => {
  return await userbase().doc(user.id).set(user).catch(console.error);
};

export const updateUser = async (id: string, data: Omit<DBUser, "id">) => {
  return await userbase()
    .doc(id)
    .set(data, {
      merge: true,
    })
    .catch(console.error);
};
