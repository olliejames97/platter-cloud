import { SampleLink, UserLink } from "../links/links";

export type DBSample = {
  id: string;
  name?: string;
  tagLinks?: Array<SampleLink>;
  userLink: UserLink;
  url: string;
};
