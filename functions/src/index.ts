import * as functions from "firebase-functions";
import gqlServer from "./gqlServer";
import { isProd } from "./config";
import { createUser } from "./users/helpers";
import { createSample } from "./samples/helpers";
import { DBSample } from "./samples/types";
import { uuid } from "uuidv4";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const server = gqlServer();

export const status = functions.https.onRequest((request, response) => {
  response.send(
    "Project: " +
      process.env.GCLOUD_PROJECT +
      "<br/>" +
      "Environment is production: " +
      isProd
  );
});

export const onFirebaseSignup = functions.auth.user().onCreate(async (user) => {
  console.log("A new user has been created ", user.email);
  const newUserDoc = await createUser({
    id: user.uid,
  });
  console.log("new user", newUserDoc);
  return null;
});

export const api = functions.https.onRequest(server);

export const onStorageChange = functions.storage
  .object()
  .onFinalize(async (e) => {
    console.log("new file ", e.name, e);
    const sample = fileToDbSample(e);
    if (!sample) {
      console.log("file not valid");
      return null;
    }
    await createSample(sample).catch(console.error);
    return true;
  });

const fileToDbSample = (
  file: functions.storage.ObjectMetadata
): DBSample | null => {
  if (!file || !file.name || !file.mediaLink) {
    return null;
  }
  return {
    id: uuid(),
    userLink: {
      type: "user",
      id: "not-implemented", // attach to metadata in app
    },
    url: file.mediaLink,
    name: file.name,
  };
};
