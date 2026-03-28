import { z } from "zod";

import { vitalTypeSchema, vitalSourceSchema } from "@/features/vitals/schemas/vitals.schema";

export const csvImportSchema = z.object({
  profileId: z.string().min(1),
  type: vitalTypeSchema,
  unit: z.string().min(1).max(24),
  source: vitalSourceSchema.default("CSV"),
  csv: z.string().min(1),
  timezone: z.string().default("UTC"),
});
