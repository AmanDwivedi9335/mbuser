import type { VaultRecord } from "@/features/records/types/record.types";
import { RecordCard } from "@/features/records/components/record-card";

export function RecordList({ records, isLoading }: { records: VaultRecord[]; isLoading: boolean }) {
  if (isLoading) {
    return <p className="text-sm text-app-muted">Loading records...</p>;
  }

  if (records.length === 0) {
    return <p className="rounded-lg border border-dashed border-app-border p-6 text-sm text-app-muted">No records found.</p>;
  }

  return (
    <div className="grid gap-3">
      {records.map((record) => (
        <RecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}
