import { DBSample } from "./types";
import { writeSample, dbSampleToSampple, fetchDbSample } from "./database";

export const createSample = async (sample: DBSample) => {
  return await writeSample(sample);
};

export const getSample = async (id: string) => {
  return await dbSampleToSampple(await fetchDbSample(id));
};
