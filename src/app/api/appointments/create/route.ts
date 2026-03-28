import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { formatZodError } from "@/lib/validations/zod";
import { createAppointmentSchema } from "@/features/appointments/schemas/appointment.schema";
import { createAppointmentForProfile } from "@/features/appointments/services/appointments.server";

export async function POST(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = createAppointmentSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid appointment payload", details: formatZodError(parsed.error) }, { status: 400 });
    }

    const appointment = await createAppointmentForProfile({
      userId: user.id,
      input: parsed.data,
    });

    return NextResponse.json({ appointmentId: appointment.id }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create appointment";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
