import { NextResponse } from "next/server";

import { completeOnboarding } from "@/features/onboarding/services/onboarding.server";
import { requireSessionUser } from "@/lib/auth/require-user";

export async function POST() {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await completeOnboarding(user.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to complete onboarding" },
      { status: 400 },
    );
  }
}
