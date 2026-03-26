import { z } from "zod";

const BLOOD_GROUP_REGEX = /^(A|B|AB|O)[+-]$/;

export const primaryProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(120),
  relation: z.literal("SELF"),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date of birth"),
  gender: z.enum(["MALE", "FEMALE", "NON_BINARY", "OTHER", "PREFER_NOT_TO_SAY"]),
  bloodGroup: z
    .string()
    .trim()
    .toUpperCase()
    .regex(BLOOD_GROUP_REGEX, "Blood group must look like A+, O-, AB+")
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),
});

export type PrimaryProfileSchemaInput = z.input<typeof primaryProfileSchema>;
export type PrimaryProfileSchemaOutput = z.output<typeof primaryProfileSchema>;
