import { NextResponse } from "next/server";

import { formatZodError } from "@/lib/validations/zod";
import { requireSessionUser } from "@/lib/auth/require-user";
import { createMedicationSchema } from "@/features/medications/schemas/medication.schema";
import { createMedicationForProfile } from "@/features/medications/services/medications.server";

export async function POST(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = createMedicationSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid medication payload", details: formatZodError(parsed.error) }, { status: 400 });
    }

    const medication = await createMedicationForProfile({
      user,
      input: parsed.data,
    });

    return NextResponse.json({ medicationId: medication.id }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create medication";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
