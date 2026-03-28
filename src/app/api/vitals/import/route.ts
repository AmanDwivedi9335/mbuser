import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { formatZodError } from "@/lib/validations/zod";
import { csvImportSchema } from "@/features/vitals/schemas/csv.schema";
import { importVitalsForProfile } from "@/features/vitals/services/vitals.server";

export async function POST(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = csvImportSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid import payload", details: formatZodError(parsed.error) }, { status: 400 });
    }

    const data = await importVitalsForProfile({
      userId: user.id,
      input: parsed.data,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to import vitals";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
