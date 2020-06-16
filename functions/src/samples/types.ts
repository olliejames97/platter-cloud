import { UserLink, TagLink } from "../links/links";

export type ValidFileTypes = "wav" | "mp3" | "aif";

export type DBSample = {
  id: string;
  name: string;
  filetype: "wav" | "mp3" | "aif";
  tagLinks: Array<TagLink>;
  userLink: UserLink;
  url: string;
  createdAt: Date;
  downloads: number;
};
