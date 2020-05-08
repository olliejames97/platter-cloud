import { SampleLink } from "../links/links";

export type DBUser = {
  id: string;
  sampleLinks?: Array<SampleLink> | undefined;
  username?: string;
};
