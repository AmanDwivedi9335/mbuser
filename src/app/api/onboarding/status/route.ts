import { NextResponse } from "next/server";

import { getOnboardingStatus } from "@/features/onboarding/services/onboarding.server";
import { requireSessionUser } from "@/lib/auth/require-user";

export async function GET() {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await getOnboardingStatus(user.id);
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load status" }, { status: 400 });
  }
}
