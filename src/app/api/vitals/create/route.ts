import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { formatZodError } from "@/lib/validations/zod";
import { createVitalSchema } from "@/features/vitals/schemas/vitals.schema";
import { createVitalForProfile } from "@/features/vitals/services/vitals.server";

export async function POST(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = createVitalSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid vital payload", details: formatZodError(parsed.error) }, { status: 400 });
    }

    const vital = await createVitalForProfile({ userId: user.id, input: parsed.data });

    return NextResponse.json({ vitalId: vital.id }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create vital";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
