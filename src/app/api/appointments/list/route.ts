import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { parseQuery } from "@/lib/utils/validations/parse-query";
import { listAppointmentsQuerySchema } from "@/features/appointments/schemas/appointment.schema";
import { listAppointmentsForProfile } from "@/features/appointments/services/appointments.server";

export async function GET(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const query = parseQuery(new URL(request.url).searchParams, listAppointmentsQuerySchema);

    const data = await listAppointmentsForProfile({
      userId: user.id,
      profileId: query.profileId,
      status: query.status,
      fromDate: query.fromDate,
      toDate: query.toDate,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to list appointments";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
