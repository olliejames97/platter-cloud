import { User } from "../generated/graphql";
import { writeUser, fetchDbUser, updateUser } from "./database";
import { getUserIdFirebase } from "../auth";
import { ApolloError } from "apollo-server-express";
import { resolveDbUser } from "./resolvers";
import { DBUser } from "./types";
import * as _ from "lodash";

export const getUserWithToken = async (token: string): Promise<User | null> => {
  console.log("getting user with token: ", token.substr(0, 10));
  const userId = await getUserIdFirebase(token).catch(() => {
    throw new ApolloError("Couldn't get firebase ID");
  });
  if (!userId) {
    console.log("user has no ID");
    return null;
  }
  const dbUser = await fetchDbUser(userId);

  return userId ? await resolveDbUser(dbUser) : null;
};

export const createUser = async (
  user: Partial<DBUser> & Pick<DBUser, "id">
) => {
  return await writeUser(user);
};

export const getUser = async (id: string) => {
  return await resolveDbUser(await fetchDbUser(id));
};

export const writeSampleIdToUser = async (userId: string, sampleId: string) => {
  const user = await fetchDbUser(userId);
  let samples = _.clone(user.sampleLinks);
  console.log("writing sample", sampleId, "to user", userId);
  if (samples) {
    samples.push({
      id: sampleId,
      type: "sample",
    });
  } else {
    samples = [
      {
        type: "sample",
        id: sampleId,
      },
    ];
  }
  updateUser(userId, {
    sampleLinks: samples,
  });
};
