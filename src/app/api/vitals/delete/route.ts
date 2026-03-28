import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { formatZodError } from "@/lib/validations/zod";
import { deleteVitalSchema } from "@/features/vitals/schemas/vitals.schema";
import { deleteVitalById } from "@/features/vitals/services/vitals.server";

export async function POST(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = deleteVitalSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid delete payload", details: formatZodError(parsed.error) }, { status: 400 });
    }

    await deleteVitalById({ userId: user.id, vitalId: parsed.data.vitalId });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to delete vital";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
