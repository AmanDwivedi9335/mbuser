"use client";

import { deleteVital } from "@/features/vitals/services/vitals.client";
import type { VitalItem } from "@/features/vitals/types/vitals.types";

function formatValue(item: VitalItem) {
  if (item.type === "BP") {
    return `${item.value1}/${item.value2 ?? "-"} ${item.unit}`;
  }

  return `${item.value1} ${item.unit}`;
}

export function VitalsList({ vitals, isLoading, onDeleted }: { vitals: VitalItem[]; isLoading: boolean; onDeleted: () => void }) {
  const grouped = vitals.reduce<Record<string, VitalItem[]>>((acc, item) => {
    const day = new Date(item.recordedAt).toLocaleDateString();
    acc[day] ??= [];
    acc[day].push(item);
    return acc;
  }, {});

  if (isLoading) return <p className="text-sm text-app-muted">Loading vitals...</p>;
  if (!vitals.length) return <p className="text-sm text-app-muted">No vitals found for selected range.</p>;

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([day, items]) => (
        <div key={day} className="rounded-xl border border-app-border bg-app-panel p-3">
          <h3 className="text-sm font-semibold">{day}</h3>
          <ul className="mt-2 space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-md border border-app-border/70 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium">{formatValue(item)}</p>
                  <p className="text-xs text-app-muted">{new Date(item.recordedAt).toLocaleTimeString()} • {item.source}</p>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-app-border px-3 py-1 text-xs"
                  onClick={async () => {
                    await deleteVital(item.id);
                    onDeleted();
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
