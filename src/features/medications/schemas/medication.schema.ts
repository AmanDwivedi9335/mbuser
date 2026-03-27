import { z } from "zod";

import { scheduleArraySchema } from "@/features/medications/schemas/schedule.schema";

export const medicationFrequencySchema = z.enum([
  "ONCE_DAILY",
  "TWICE_DAILY",
  "THRICE_DAILY",
  "EVERY_X_HOURS",
  "WEEKLY",
  "CUSTOM",
]);

export const createMedicationSchema = z
  .object({
    profileId: z.string().min(1, "Profile is required"),
    name: z.string().trim().min(2).max(200),
    dosage: z.coerce.number().positive("Dosage must be greater than zero").max(50000),
    unit: z.string().trim().min(1).max(20),
    instructions: z.string().trim().max(4000).optional(),
    startDate: z.string().date(),
    endDate: z.union([z.string().date(), z.literal("")]).optional().transform((value) => (value ? value : undefined)),
    frequencyType: medicationFrequencySchema,
    schedules: scheduleArraySchema,
  })
  .refine((payload) => !payload.endDate || payload.endDate >= payload.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

export const listMedicationsQuerySchema = z.object({
  profileId: z.string().min(1),
  status: z.enum(["active", "inactive", "all"]).default("active"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

export const medicationLogSchema = z.object({
  profileId: z.string().min(1),
  medicationId: z.string().min(1),
  status: z.enum(["TAKEN", "SKIPPED"]),
  scheduledAt: z.string().datetime().optional(),
});

export const listMedicationLogsQuerySchema = z.object({
  profileId: z.string().min(1),
  medicationId: z.string().optional(),
  fromDate: z.string().date().optional(),
  toDate: z.string().date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const medicationIdSchema = z.object({
  id: z.string().min(1),
});

export const medicationStatusUpdateSchema = z.object({
  isActive: z.boolean(),
});
