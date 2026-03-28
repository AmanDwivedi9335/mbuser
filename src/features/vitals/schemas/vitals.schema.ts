import { z } from "zod";

const isoDateSchema = z.string().datetime({ offset: true });

export const vitalTypeSchema = z.enum(["BP", "HR", "WEIGHT", "SUGAR", "SLEEP", "STEPS", "SPO2", "TEMP"]);
export const vitalSourceSchema = z.enum(["MANUAL", "CSV", "WEARABLE"]);

export const createVitalSchema = z.object({
  profileId: z.string().min(1),
  type: vitalTypeSchema,
  value1: z.coerce.number(),
  value2: z.coerce.number().optional(),
  unit: z.string().min(1).max(24),
  source: vitalSourceSchema.default("MANUAL"),
  recordedAt: isoDateSchema,
});

export const listVitalsQuerySchema = z.object({
  profileId: z.string().min(1),
  type: vitalTypeSchema.optional(),
  fromDate: isoDateSchema.optional(),
  toDate: isoDateSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  sort: z.enum(["asc", "desc"]).default("desc"),
});

export const deleteVitalSchema = z.object({
  vitalId: z.string().min(1),
});
