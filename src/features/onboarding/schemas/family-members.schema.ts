import { z } from "zod";

const BLOOD_GROUP_REGEX = /^(A|B|AB|O)[+-]$/;

const familyMemberSchema = z.object({
  id: z.string().min(1),
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  relation: z.enum(["SPOUSE", "SON", "DAUGHTER", "FATHER", "MOTHER", "GRANDPARENT", "OTHER"]),
  dob: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), "Enter a valid date of birth"),
  gender: z
    .enum(["MALE", "FEMALE", "NON_BINARY", "OTHER", "PREFER_NOT_TO_SAY"])
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),
  bloodGroup: z
    .string()
    .trim()
    .toUpperCase()
    .regex(BLOOD_GROUP_REGEX, "Blood group must look like A+, O-, AB+")
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),
});

export const familyMembersSchema = z.object({
  members: z.array(familyMemberSchema),
});

export type FamilyMembersSchemaInput = z.input<typeof familyMembersSchema>;
export type FamilyMembersSchemaOutput = z.output<typeof familyMembersSchema>;
export type FamilyMemberSchemaInput = z.input<typeof familyMemberSchema>;
