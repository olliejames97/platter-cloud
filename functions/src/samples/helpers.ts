import { DBSample } from "./types";
import { writeSample } from "./database";

export const createSample = async (sample: DBSample) => {
  return await writeSample(sample);
};
