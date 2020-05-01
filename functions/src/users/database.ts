// Database abstraction layer
import * as admin from "firebase-admin";
import { User } from "../generated/graphql";

export const getUser = (id: string) => null;

export const writeUser = async (user: Partial<User> & Pick<User, "id">) => {
  return await admin
    .firestore()
    .collection("users")
    .add(user)
    .catch(console.error);
};
