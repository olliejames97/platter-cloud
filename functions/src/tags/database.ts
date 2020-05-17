import { DBTag } from "./types";
import * as admin from "firebase-admin";
import { ApolloError } from "apollo-server-express";
import { Tag } from "../generated/graphql";
import { resolveSampleLink } from "../links/links";
// import { Tag } from "../generated/graphql";

const tagbase = () => {
  return admin.firestore().collection("tags");
};

export const writeTag = async (tag: DBTag): Promise<boolean> => {
  console.log("writing tag to DB ", tag.title);
  // need to get id then write
  return await tagbase()
    .doc(tag.title)
    .set(tag)
    .then((e) => true)
    .catch((e) => {
      console.error(e);
      return false;
    });
};

export const addSampleToTag = async (tagTitle: string, sampleId: string) => {
  console.log("adding sample to tag ", tagTitle, sampleId);
  const existingTag = await fetchDbTag(tagTitle);
  if (existingTag) {
    const result = await updateTag(tagTitle, {
      title: tagTitle,
      sampleLinks: [
        ...existingTag.sampleLinks,
        {
          id: sampleId,
          type: "sample",
        },
      ],
    }).catch(() => {
      throw new ApolloError("Error updating tag");
    });
    return result;
  }

  await writeTag({
    title: tagTitle,
    sampleLinks: [
      {
        id: sampleId,
        type: "sample",
      },
    ],
  }).catch(() => {
    throw new ApolloError("Error writing new tag");
  });

  return await fetchDbTag(tagTitle);
};

export const fetchDbTag = async (title: string): Promise<DBTag | undefined> => {
  const doc = await tagbase()
    .doc(title)
    .get()
    .catch(() => {
      throw new ApolloError("Couldn't get tag");
    });

  const data = doc.data();
  if (!data || !data.title) {
    console.log("no tag exists");
    return undefined;
  }
  console.log("fetching db tag");
  // todo move null checks up and throw if null
  return {
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

  const tag = await fetchDbTag(id);
  if (!tag) {
    throw new ApolloError("Couldn't fetch tag");
  }
  return tag;
};

export const dbTagToTag = async (db: DBTag): Promise<Tag> => {
  return {
    title: db.title,
    samples: await Promise.all(
      db.sampleLinks.map(async (sl) => await resolveSampleLink(sl))
    ),
  };
};
