import { NextResponse } from "next/server";

import { formatZodError } from "@/lib/validations/zod";
import { requireSessionUser } from "@/lib/auth/require-user";
import { recordMetadataSchema, validateUploadFile } from "@/features/records/schemas/record.schema";
import { createRecordWithUpload } from "@/features/records/services/records.server";

export async function POST(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    validateUploadFile(file);

    const parsed = recordMetadataSchema.safeParse({
      profileId: formData.get("profileId"),
      category: formData.get("category"),
      title: formData.get("title"),
      providerName: formData.get("providerName") || undefined,
      recordDate: formData.get("recordDate") || undefined,
      notes: formData.get("notes") || undefined,
      tags: formData.get("tags") ? JSON.parse(String(formData.get("tags"))) : undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid metadata", details: formatZodError(parsed.error) }, { status: 400 });
    }

    const record = await createRecordWithUpload({
      user,
      file,
      metadata: parsed.data,
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
