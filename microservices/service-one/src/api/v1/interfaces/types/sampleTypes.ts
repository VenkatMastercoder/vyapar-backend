import { z } from "zod";
import { sampleSchema } from "../../validations/sampleZod";

export type sampleData = z.infer<typeof sampleSchema>