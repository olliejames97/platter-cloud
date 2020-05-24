import { getUser } from "../users/helpers";
import { getSample } from "../samples/helpers";
import { getTag } from "../tags/helpers";

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

export interface TagLink extends BaseLink {
  type: "tag";
  title: "";
}

export const resolveUserLink = (link: UserLink) => getUser(link.id);

export const resolveSampleLink = (link: SampleLink) => getSample(link.id);
export const resolveTagLink = (link: TagLink) => getTag(link.id);
