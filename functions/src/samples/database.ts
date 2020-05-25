import * as admin from "firebase-admin";
import { DBSample } from "./types";
import { ApolloError } from "apollo-server-express";
import { Sample, TagText } from "../generated/graphql";

const samplebase = () => {
  return admin.firestore().collection("samples");
};

export const writeSample = async (
  id: string,
  sample: Omit<DBSample, "id">
): Promise<string> => {
  console.log("writing sample to DB with name ", sample);
  await samplebase()
    .doc(id)
    .set(sample)
    .catch(() => {
      throw new ApolloError("Error writing sample to DB");
    });

  return id;
};

export const getSamplesWithTags = async (
  tags: Array<string>
): Promise<Array<DBSample>> => {
  const queryResult = await samplebase()
    .where(
      "tagLinks",
      "array-contains-any",
      tags.map((t) => ({
        id: t.toLowerCase(),
        type: "tag",
        title: "",
      }))
    )
    .get();
  const results = queryResult.docs.map((doc) => {
    return <DBSample>doc.data();
  });
  return results;
};

export const fetchDbSample = async (id: string): Promise<DBSample> => {
  console.log("Getting sample with Id", id);
  const doc = await samplebase()
    .doc(id)
    .get()
    .catch(() => {
      throw new ApolloError("Couldn't get sample");
    });

  if (!doc.exists) {
    throw new ApolloError("Sample doesn't exist");
  }

  if (!doc.ref || !doc.ref.id) {
    throw new ApolloError(
      "Couldn't fetch sample " +
        JSON.stringify(doc.ref) +
        "   " +
        JSON.stringify(doc, null, 2)
    );
  }
  const data = doc.data();
  // todo move null checks up and throw if null
  if (!data || !doc.id) {
    console.log("no data or no doc id");
    throw new ApolloError("No doc id");
  }

  return {
    id,
    name: data?.name,
    tagLinks: data?.tagLinks,
    userLink: data?.userLink,
    url: data?.url,
  };
};

export const updateSample = async (
  id: string,
  data: Partial<Omit<DBSample, "id">>
): Promise<DBSample> => {
  if (!data) {
    throw new ApolloError("No data to rewrite");
  }
  console.log(data);
  await samplebase()
    .doc(id)
    .update(data)
    .catch(() => {
      throw new ApolloError("Couldn't rewrite sample");
    });
  console.log("here");
  return await fetchDbSample(id);
};

export const dbSampleToSample = async (db: DBSample): Promise<Sample> => {
  console.log("resolving sample ", db.id);

  return {
    downloads: 0,
    id: db.id,
    user: {
      id: db.userLink.id,
    },
    name: db.name,
    url: db.url,
    tagLink: db.tagLinks.map(
      (tl): TagText => ({
        name: tl.id,
      })
    ),
  };
};
