import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { parseQuery } from "@/lib/utils/validations/parse-query";
import { listRecordsQuerySchema } from "@/features/records/schemas/record.schema";
import { listRecordsForProfile } from "@/features/records/services/records.server";

export async function GET(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const query = parseQuery(new URL(request.url).searchParams, listRecordsQuerySchema);
    const records = await listRecordsForProfile({
      userId: user.id,
      profileId: query.profileId,
      category: query.category,
      fromDate: query.fromDate,
      toDate: query.toDate,
    });

    return NextResponse.json({ records });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to list records";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
