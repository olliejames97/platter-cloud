import * as functions from "firebase-functions";
import gqlServer from "./gqlServer";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const server = gqlServer();

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export const api = functions.https.onRequest(server);
