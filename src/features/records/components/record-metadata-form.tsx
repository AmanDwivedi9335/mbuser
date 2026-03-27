"use client";

import { recordCategorySchema } from "@/features/records/schemas/record.schema";
import type { UploadRecordPayload } from "@/features/records/types/record.types";

const categories = recordCategorySchema.options;

type Props = {
  value: UploadRecordPayload;
  onChange: (next: UploadRecordPayload) => void;
};

export function RecordMetadataForm({ value, onChange }: Props) {
  return (
    <div className="grid gap-3 rounded-lg border border-app-border p-4">
      <label className="grid gap-1 text-sm">
        <span className="text-app-muted">Title</span>
        <input
          className="rounded-md border border-app-border bg-transparent px-3 py-2"
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          required
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="text-app-muted">Category</span>
        <select
          className="rounded-md border border-app-border bg-transparent px-3 py-2"
          value={value.category}
          onChange={(event) => onChange({ ...value, category: event.target.value as UploadRecordPayload["category"] })}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm">
        <span className="text-app-muted">Provider</span>
        <input
          className="rounded-md border border-app-border bg-transparent px-3 py-2"
          value={value.providerName ?? ""}
          onChange={(event) => onChange({ ...value, providerName: event.target.value })}
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="text-app-muted">Record date</span>
        <input
          type="date"
          className="rounded-md border border-app-border bg-transparent px-3 py-2"
          value={value.recordDate ?? ""}
          onChange={(event) => onChange({ ...value, recordDate: event.target.value })}
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="text-app-muted">Notes</span>
        <textarea
          className="min-h-24 rounded-md border border-app-border bg-transparent px-3 py-2"
          value={value.notes ?? ""}
          onChange={(event) => onChange({ ...value, notes: event.target.value })}
        />
      </label>
    </div>
  );
}
