import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { formatZodError } from "@/lib/validations/zod";
import { createFollowUpSchema } from "@/features/appointments/schemas/appointment.schema";
import { createFollowUp } from "@/features/appointments/services/appointments.server";

export async function POST(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = createFollowUpSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid follow-up payload", details: formatZodError(parsed.error) }, { status: 400 });
    }

    await createFollowUp({
      userId: user.id,
      appointmentId: parsed.data.appointmentId,
      mode: parsed.data.mode,
      followUpAt: parsed.data.followUpAt,
      title: parsed.data.title,
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create follow-up";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
