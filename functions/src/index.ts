import * as functions from "firebase-functions";
import gqlServer from "./gqlServer";
import { isProd } from "./config";
import { createUser } from "./users/helpers";

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
