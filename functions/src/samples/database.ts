import * as admin from "firebase-admin";
import { DBSample } from "./types";
import { ApolloError } from "apollo-server-express";
import { Sample } from "../generated/graphql";
import { resolveUserLink, resolveTagLink } from "../links/links";

const samplebase = () => {
  return admin.firestore().collection("samples");
};

export const writeSample = async (
  sample: Omit<DBSample, "id">
): Promise<string> => {
  console.log("writing sample to DB ", sample.name);
  return await samplebase()
    .add({
      sample,
    })
    .catch(console.error)
    .then((ref) => {
      if (!ref) {
        throw new ApolloError("Couldn't write");
      }
      console.log("written ", ref.id);
      return ref.id;
    });
};

export const fetchDbSample = async (id: string): Promise<DBSample> => {
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
  console.log("writing", data, {
    id: "fix fetchDbSample",
    name: data?.name,
    tagLinks: data?.tagLinks,
    userLink: data?.userLink,
    url: data?.url,
  });

  return {
    id: "fix fetchDbSample",
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

export const dbSampleToSample = async (db: DBSample): Promise<Sample> => {
  console.log("resolving sample ", db, db.id);
  return {
    downloads: 0,
    id: db.id,
    user: await resolveUserLink(db.userLink),
    tags:
      db.tagLinks &&
      (await Promise.all(
        db.tagLinks.map((tl) => {
          return resolveTagLink(tl);
        })
      )),
  };
};
