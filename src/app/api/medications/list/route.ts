import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { parseQuery } from "@/lib/utils/validations/parse-query";
import { listMedicationsQuerySchema } from "@/features/medications/schemas/medication.schema";
import { listMedicationsForProfile } from "@/features/medications/services/medications.server";

export async function GET(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const query = parseQuery(new URL(request.url).searchParams, listMedicationsQuerySchema);

    const data = await listMedicationsForProfile({
      userId: user.id,
      profileId: query.profileId,
      status: query.status,
      page: query.page,
      pageSize: query.pageSize,
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to list medications";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
