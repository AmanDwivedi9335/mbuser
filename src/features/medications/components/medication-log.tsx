"use client";

import { useMemo, useState } from "react";

import type { MedicationLogItem } from "@/features/medications/types/medication.types";

const STATUS_COLOR: Record<string, string> = {
  TAKEN: "text-emerald-400",
  SKIPPED: "text-amber-400",
  MISSED: "text-red-400",
};

export function MedicationLog({ logs }: { logs: MedicationLogItem[] }) {
  const [dateFilter, setDateFilter] = useState("");

  const filteredLogs = useMemo(() => {
    if (!dateFilter) return logs;
    return logs.filter((log) => log.scheduledAt.slice(0, 10) === dateFilter);
  }, [logs, dateFilter]);

  return (
    <section className="space-y-3 rounded-xl border border-app-border bg-app-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold">Medication history</h3>
        <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="rounded-md border border-app-border bg-transparent px-3 py-2 text-sm" />
      </div>

      {filteredLogs.length === 0 ? <p className="text-sm text-app-muted">No logs available for selected date.</p> : null}

      <ul className="space-y-2">
        {filteredLogs.map((log) => (
          <li key={log.id} className="flex items-center justify-between rounded-md border border-app-border px-3 py-2 text-sm">
            <span>{new Date(log.scheduledAt).toLocaleString()}</span>
            <span className={`font-medium ${STATUS_COLOR[log.status] ?? "text-app-muted"}`}>{log.status.toLowerCase()}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
