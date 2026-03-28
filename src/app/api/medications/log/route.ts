import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { parseQuery } from "@/lib/utils/validations/parse-query";
import { listMedicationLogsQuerySchema, medicationLogSchema } from "@/features/medications/schemas/medication.schema";
import { createMedicationLog, listMedicationLogs } from "@/features/medications/services/medications.server";

type MedicationLogListItem = Awaited<ReturnType<typeof listMedicationLogs>>[number];

export async function POST(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = medicationLogSchema.parse(await request.json());

    await createMedicationLog({
      userId: user.id,
      profileId: payload.profileId,
      medicationId: payload.medicationId,
      status: payload.status,
      scheduledAt: payload.scheduledAt,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to log medication";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const query = parseQuery(new URL(request.url).searchParams, listMedicationLogsQuerySchema);
    const logs = await listMedicationLogs({
      userId: user.id,
      profileId: query.profileId,
      medicationId: query.medicationId,
      fromDate: query.fromDate,
      toDate: query.toDate,
      page: query.page,
      pageSize: query.pageSize,
    });

    return NextResponse.json({
      logs: logs.map((log: MedicationLogListItem) => ({
        ...log,
        scheduledAt: log.scheduledAt.toISOString(),
        takenAt: log.takenAt ? log.takenAt.toISOString() : null,
        createdAt: log.createdAt.toISOString(),
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to load logs";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
