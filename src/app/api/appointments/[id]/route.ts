import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { getAppointmentById } from "@/features/appointments/services/appointments.server";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const appointment = await getAppointmentById({ userId: user.id, appointmentId: id });
    return NextResponse.json({ appointment });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to fetch appointment";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
