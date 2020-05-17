import * as admin from "firebase-admin";
import { DBSample } from "./types";
import { ApolloError } from "apollo-server-express";
import { Sample } from "../generated/graphql";
import { resolveUserLink, resolveTagLink } from "../links/links";

const samplebase = () => {
  return admin.firestore().collection("samples");
};

export const writeSample = async (
  id: string,
  sample: Omit<DBSample, "id">
): Promise<string> => {
  console.log("writing sample to DB with name ", sample.name);
  await samplebase()
    .doc(id)
    .set(sample)
    .catch(() => {
      throw new ApolloError("Error writing sample to DB");
    });

  return id;
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
  console.log("sample: ", {
    id,
    name: data?.name,
    tagLinks: data?.tagLinks,
    userLink: data?.userLink,
    url: data?.url,
  });
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

  const tags = await Promise.all(
    db.tagLinks.map(async (tl) => {
      console.log("resolving a tag link");
      const tag = await resolveTagLink(tl);
      if (!tag) {
        throw new ApolloError("No tag");
      }
      return tag;
    })
  );

  return {
    downloads: 0,
    id: db.id,
    user: await resolveUserLink(db.userLink),
    name: db.name,
    url: db.url,
    tags,
  };
};
