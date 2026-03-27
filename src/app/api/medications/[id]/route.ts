import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSessionUser } from "@/lib/auth/require-user";
import { medicationStatusUpdateSchema } from "@/features/medications/schemas/medication.schema";
import { getMedicationById, updateMedicationStatus } from "@/features/medications/services/medications.server";

const routeParamsSchema = z.object({
  id: z.string().min(1),
});

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = routeParamsSchema.parse(await context.params);
    const medication = await getMedicationById({ userId: user.id, medicationId: params.id });

    return NextResponse.json({ medication });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to fetch medication";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = routeParamsSchema.parse(await context.params);
    const payload = medicationStatusUpdateSchema.parse(await request.json());

    await updateMedicationStatus({
      userId: user.id,
      medicationId: params.id,
      isActive: payload.isActive,
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to update medication";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
