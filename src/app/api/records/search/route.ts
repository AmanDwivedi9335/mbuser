import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { parseQuery } from "@/lib/utils/validations/parse-query";
import { searchRecordsQuerySchema } from "@/features/records/schemas/record.schema";
import { searchRecords } from "@/features/records/services/records.server";

export async function GET(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const query = parseQuery(new URL(request.url).searchParams, searchRecordsQuerySchema);
    const records = await searchRecords({
      userId: user.id,
      profileId: query.profileId,
      query: query.q,
    });

    return NextResponse.json({ records, query: query.q });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to search records";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
