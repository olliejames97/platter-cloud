import { UserLink, TagLink } from "../links/links";

export type DBSample = {
  id: string;
  name: string;
  tagLinks: Array<TagLink>;
  userLink: UserLink;
  url: string;
};
