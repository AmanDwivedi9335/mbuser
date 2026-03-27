import { z } from "zod";

export const scheduleEntrySchema = z.object({
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format")
    .trim(),
  dayOfWeek: z.number().int().min(0).max(6).nullable().optional(),
  intervalHours: z.number().int().min(1).max(24).nullable().optional(),
});

export const scheduleArraySchema = z.array(scheduleEntrySchema).min(1, "At least one schedule time is required");
