import Link from "next/link";

import type { VaultRecord } from "@/features/records/types/record.types";

const recordDateFormatter = new Intl.DateTimeFormat(undefined, {
  timeZone: "UTC",
});

export function RecordCard({ record }: { record: VaultRecord }) {
  return (
    <article className="rounded-xl border border-app-border bg-app-panel p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-app-text">{record.title}</h3>
          <p className="text-sm text-app-muted">{record.category.replaceAll("_", " ")}</p>
        </div>
        <Link className="text-sm font-medium text-app-accent hover:underline" href={`/dashboard/records/${record.id}`}>
          View
        </Link>
      </div>

      <dl className="mt-3 space-y-1 text-sm text-app-muted">
        <div>
          <dt className="inline font-medium text-app-text">Provider: </dt>
          <dd className="inline">{record.providerName ?? "Not specified"}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-app-text">Record date: </dt>
          <dd className="inline">{record.recordDate ? recordDateFormatter.format(new Date(record.recordDate)) : "N/A"}</dd>
        </div>
      </dl>
    </article>
  );
}
