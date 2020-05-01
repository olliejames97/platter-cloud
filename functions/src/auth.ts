// firebase-auth abstraction layer - all interaction with firebase-auth should be done in here
import * as admin from "firebase-admin";
import { serviceAccountKeys } from "./config";

export const initFirebaseAdmin = () => {
  console.log("initialising firebase admin");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKeys),
  });
};

export const getUserIdFirebase = async (
  token: string
): Promise<string | null> => {
  const decodedToken = await admin
    .auth()
    .verifyIdToken(token)
    .catch(() => null);
  return decodedToken?.uid ?? null;
};
