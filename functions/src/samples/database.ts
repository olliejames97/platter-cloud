import * as admin from "firebase-admin";
import { DBSample } from "./types";
import { ApolloError } from "apollo-server-express";
import { Sample } from "../generated/graphql";
import { resolveUserLink } from "../links/links";

const samplebase = () => {
  return admin.firestore().collection("samples");
};

export const writeSample = async (sample: DBSample) => {
  console.log("writing sample to DB ", sample.id);
  await samplebase()
    .doc(sample.id)
    .set(sample)
    .catch(console.error)
    .then((e) => {
      console.log("written ", e);
    });
};

export const fetchDbSample = async (id: string): Promise<DBSample> => {
  const doc = await samplebase()
    .doc(id)
    .get()
    .catch(() => {
      throw new ApolloError("Couldn't get sample");
    });
  const data = doc.data();
  if (!data || !data.id) {
    throw new ApolloError("Couldn't fetch sample");
  }

  // todo move null checks up and throw if null
  return {
    id: data.id,
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
  return await fetchDbSample(id);
};

export const dbSampleToSampple = async (db: DBSample): Promise<Sample> => {
  return {
    downloads: 0,
    id: db.id,
    user: await resolveUserLink(db.userLink),
  };
};
