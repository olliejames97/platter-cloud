import { dbSampleToSample, fetchDbSample } from "./database";

// export const createSample = async (sample: DBSample) => {
//   return await writeSample(sample);
// };

export const getSample = async (id: string) => {
  return await dbSampleToSample(await fetchDbSample(id));
};
