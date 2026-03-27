import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/require-user";
import { getDecryptedRecordFile, getRecordDetails } from "@/features/records/services/records.server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const url = new URL(request.url);

  try {
    if (url.searchParams.get("download") === "1") {
      const file = await getDecryptedRecordFile({
        userId: user.id,
        recordId: id,
        fileId: url.searchParams.get("fileId") ?? undefined,
      });

      return new NextResponse(file.buffer, {
        headers: {
          "Content-Type": file.mimeType,
          "Content-Disposition": `inline; filename="${encodeURIComponent(file.originalName)}"`,
          "Cache-Control": "private, no-store",
        },
      });
    }

    const record = await getRecordDetails({ userId: user.id, recordId: id });
    return NextResponse.json({ record });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to read record";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
