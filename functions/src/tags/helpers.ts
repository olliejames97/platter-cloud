import { fetchDbTag, dbTagToTag } from "./database";

export const getTag = async (title: string) => {
  const dbTag = await fetchDbTag(title);
  console.log("got tag" + dbTag);
  return dbTag && dbTagToTag(dbTag);
};
