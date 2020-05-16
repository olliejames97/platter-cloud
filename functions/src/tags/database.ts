import { DBTag } from "./types";
import * as admin from "firebase-admin";
import { ApolloError } from "apollo-server-express";
import { Tag } from "../generated/graphql";
// import { Tag } from "../generated/graphql";

const tagbase = () => {
  return admin.firestore().collection("tags");
};

export const writeTag = async (tag: DBTag) => {
  console.log("writing tag to DB ", tag.id);
  await tagbase()
    .doc(tag.id)
    .set(tag)
    .catch(console.error)
    .then((e) => {
      console.log("written ", e);
    });
};

export const fetchDbTag = async (id: string): Promise<DBTag> => {
  const doc = await tagbase()
    .doc(id)
    .get()
    .catch(() => {
      throw new ApolloError("Couldn't get tag");
    });
  const data = doc.data();
  if (!data || !data.id) {
    throw new ApolloError("Couldn't fetch sample");
  }

  // todo move null checks up and throw if null
  return {
    id: data.id,
    sampleLinks: data?.sampleLinks,
    title: data?.title,
  };
};

export const updateTag = async (
  id: string,
  data: Partial<Omit<DBTag, "id">>
): Promise<DBTag> => {
  if (!data) {
    throw new ApolloError("No data to rewrite");
  }
  console.log(data);
  await tagbase()
    .doc(id)
    .update(data)
    .catch(() => {
      throw new ApolloError("Couldn't rewrite sample");
    });
  return await fetchDbTag(id);
};

export const dbTagToTag = (db: DBTag): Tag => {
  return {
    id: db.id,
    title: db.title,
    // sa,
  };
};
