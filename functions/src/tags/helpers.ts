import { fetchDbTag, dbTagToTag } from "./database";

export const getTag = async (id: string) => dbTagToTag(await fetchDbTag(id));
