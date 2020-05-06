export const isProd = process.env.GCLOUD_PROJECT !== "platter-app-dev";
export const serviceAccountKeys = isProd
  ? require("../service-account-prod.json")
  : require("../service-account.json");

export const bucketName = isProd ? "platter-app-8a7ce" : "platter-dev";
