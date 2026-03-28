import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { formatZodError } from "@/lib/validations/zod";
import { addAppointmentNoteSchema } from "@/features/appointments/schemas/appointment.schema";
import { addAppointmentNote } from "@/features/appointments/services/appointments.server";

export async function POST(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = addAppointmentNoteSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid note payload", details: formatZodError(parsed.error) }, { status: 400 });
    }

    await addAppointmentNote({
      userId: user.id,
      appointmentId: parsed.data.appointmentId,
      content: parsed.data.content,
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to save appointment note";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
