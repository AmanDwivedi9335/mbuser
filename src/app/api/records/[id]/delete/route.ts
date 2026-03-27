import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { softDeleteRecord } from "@/features/records/services/records.server";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await softDeleteRecord({ userId: user.id, recordId: id });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to delete record";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
