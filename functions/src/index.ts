import * as functions from "firebase-functions";
import gqlServer from "./gqlServer";
import { isProd } from "./config";

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

export const createPlatterUser = functions.auth.user().onCreate((user) => {
  console.log("A new user has been created ", user.email);
});

export const api = functions.https.onRequest(server);
