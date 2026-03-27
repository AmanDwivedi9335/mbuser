import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSessionUser } from "@/lib/auth/require-user";
import { getAdherenceInsights } from "@/features/medications/services/medications.server";

const scheduleInsightsQuerySchema = z.object({
  profileId: z.string().min(1),
  days: z.coerce.number().int().min(1).max(30).optional(),
});

export async function GET(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = new URL(request.url).searchParams;
    const query = scheduleInsightsQuerySchema.parse({
      profileId: searchParams.get("profileId"),
      days: searchParams.get("days") ?? undefined,
    });

    const insights = await getAdherenceInsights({ userId: user.id, profileId: query.profileId, days: query.days });

    return NextResponse.json({ insights });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to load adherence insights";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
