import { ZodError } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { familyMembersSchema } from "@/features/onboarding/schemas/family-members.schema";
import { householdSchema } from "@/features/onboarding/schemas/household.schema";
import { primaryProfileSchema } from "@/features/onboarding/schemas/primary-profile.schema";
import { saveOnboardingStep } from "@/features/onboarding/services/onboarding.server";
import type { SaveStepPayload } from "@/features/onboarding/types/onboarding.types";
import { requireSessionUser } from "@/lib/auth/require-user";
import { formatZodError } from "@/lib/validations/zod";

export async function POST(request: NextRequest) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as SaveStepPayload | null;

  if (!body?.step) {
    return NextResponse.json({ error: "Missing step" }, { status: 400 });
  }

  try {
    if (body.step === "HOUSEHOLD") {
      const parsed = householdSchema.parse(body.data);
      const updated = await saveOnboardingStep(user.id, { step: "HOUSEHOLD", data: parsed });
      return NextResponse.json(updated);
    }

    if (body.step === "PRIMARY_PROFILE") {
      const parsed = primaryProfileSchema.parse(body.data);
      const updated = await saveOnboardingStep(user.id, { step: "PRIMARY_PROFILE", data: parsed });
      return NextResponse.json(updated);
    }

    if (body.step === "FAMILY_MEMBERS") {
      const parsed = familyMembersSchema.parse(body.data);
      const updated = await saveOnboardingStep(user.id, { step: "FAMILY_MEMBERS", data: parsed });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Unsupported step" }, { status: 400 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", details: formatZodError(error) }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save step" }, { status: 400 });
  }
}
