import { getUser } from "../users/helpers";
import { getSample } from "../samples/helpers";

interface BaseLink {
  id: string;
  title?: string;
}

export interface SampleLink extends BaseLink {
  type: "sample";
}

export interface UserLink extends BaseLink {
  type: "user";
}

export const resolveUserLink = (link: UserLink) => getUser(link.id);

export const resolveSampleLink = (link: UserLink) => getSample(link.id);
