import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { parseQuery } from "@/lib/utils/validations/parse-query";
import { listVitalsQuerySchema } from "@/features/vitals/schemas/vitals.schema";
import { listVitalsForProfile } from "@/features/vitals/services/vitals.server";

export async function GET(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const query = parseQuery(new URL(request.url).searchParams, listVitalsQuerySchema);

    const data = await listVitalsForProfile({
      userId: user.id,
      profileId: query.profileId,
      type: query.type,
      fromDate: query.fromDate,
      toDate: query.toDate,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to list vitals";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
