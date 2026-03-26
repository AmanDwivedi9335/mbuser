import { z } from "zod";

export const householdSchema = z.object({
  name: z.string().trim().min(2, "Household name must be at least 2 characters").max(80),
});

export type HouseholdSchemaInput = z.infer<typeof householdSchema>;
