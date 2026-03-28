import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { formatZodError } from "@/lib/validations/zod";
import { updateAppointmentStatusSchema } from "@/features/appointments/schemas/appointment.schema";
import { updateAppointmentStatus } from "@/features/appointments/services/appointments.server";

export async function POST(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = updateAppointmentStatusSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status payload", details: formatZodError(parsed.error) }, { status: 400 });
    }

    await updateAppointmentStatus({
      userId: user.id,
      appointmentId: parsed.data.appointmentId,
      status: parsed.data.status,
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to update appointment status";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
