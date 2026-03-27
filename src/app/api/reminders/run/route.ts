import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { generateUpcomingReminders, runReminderDispatch } from "@/lib/scheduler/reminder-engine";

export async function POST() {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [generation, dispatch] = await Promise.all([generateUpcomingReminders(24), runReminderDispatch(100)]);

    return NextResponse.json({
      generation,
      dispatch,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to run reminder cycle";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
