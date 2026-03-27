"use client";

import { useEffect } from "react";

import type { MedicationFrequencyType, ScheduleInput } from "@/features/medications/types/medication.types";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type ScheduleBuilderProps = {
  frequencyType: MedicationFrequencyType;
  schedules: ScheduleInput[];
  onChange: (schedules: ScheduleInput[]) => void;
};

function ensureLength(schedules: ScheduleInput[], desiredLength: number) {
  if (desiredLength <= schedules.length) return schedules.slice(0, desiredLength);
  const next = [...schedules];
  while (next.length < desiredLength) {
    next.push({ time: "08:00" });
  }
  return next;
}

export function ScheduleBuilder({ frequencyType, schedules, onChange }: ScheduleBuilderProps) {
  useEffect(() => {
    if (frequencyType === "ONCE_DAILY") {
      const normalized = ensureLength(schedules, 1);
      if (normalized.length !== schedules.length) onChange(normalized);
    }

    if (frequencyType === "TWICE_DAILY" || frequencyType === "THRICE_DAILY") {
      const desired = frequencyType === "TWICE_DAILY" ? 2 : 3;
      const normalized = ensureLength(schedules, desired);
      if (normalized.length !== schedules.length) onChange(normalized);
    }
  }, [frequencyType, onChange, schedules]);

  const updateTime = (index: number, time: string) => {
    const next = [...schedules];
    next[index] = { ...next[index], time };
    onChange(next);
  };

  if (frequencyType === "ONCE_DAILY") {
    const normalized = ensureLength(schedules, 1);
    return <input type="time" value={normalized[0]?.time ?? "08:00"} onChange={(event) => updateTime(0, event.target.value)} className="w-full rounded-md border border-app-border bg-transparent px-3 py-2" />;
  }

  if (frequencyType === "TWICE_DAILY" || frequencyType === "THRICE_DAILY") {
    const count = frequencyType === "TWICE_DAILY" ? 2 : 3;
    const normalized = ensureLength(schedules, count);

    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {normalized.map((entry, index) => (
          <label key={`time-${index}`} className="space-y-1 text-sm">
            <span>Dose {index + 1} time</span>
            <input type="time" value={entry.time} onChange={(event) => updateTime(index, event.target.value)} className="w-full rounded-md border border-app-border bg-transparent px-3 py-2" />
          </label>
        ))}
      </div>
    );
  }

  if (frequencyType === "EVERY_X_HOURS") {
    const entry = schedules[0] ?? { time: "08:00", intervalHours: 6 };

    return (
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Start time</span>
          <input
            type="time"
            value={entry.time}
            onChange={(event) => onChange([{ ...entry, time: event.target.value }])}
            className="w-full rounded-md border border-app-border bg-transparent px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>Repeat every (hours)</span>
          <input
            type="number"
            min={1}
            max={24}
            value={entry.intervalHours ?? 6}
            onChange={(event) => onChange([{ ...entry, intervalHours: Number(event.target.value), dayOfWeek: null }])}
            className="w-full rounded-md border border-app-border bg-transparent px-3 py-2"
          />
        </label>
      </div>
    );
  }

  if (frequencyType === "WEEKLY") {
    const base = schedules.length > 0 ? schedules : [{ time: "08:00", dayOfWeek: 1 }];

    return (
      <div className="space-y-2">
        {base.map((entry, index) => (
          <div key={`weekly-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <select
              value={entry.dayOfWeek ?? 1}
              onChange={(event) => {
                const next = [...base];
                next[index] = { ...entry, dayOfWeek: Number(event.target.value), intervalHours: null };
                onChange(next);
              }}
              className="rounded-md border border-app-border bg-transparent px-3 py-2"
            >
              {WEEK_DAYS.map((day, dayIdx) => (
                <option key={day} value={dayIdx}>
                  {day}
                </option>
              ))}
            </select>
            <input type="time" value={entry.time} onChange={(event) => updateTime(index, event.target.value)} className="rounded-md border border-app-border bg-transparent px-3 py-2" />
            <button
              type="button"
              onClick={() => onChange(base.filter((_, itemIndex) => itemIndex !== index))}
              className="rounded-md border border-app-border px-3 py-2 text-sm"
              disabled={base.length <= 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...base, { time: "08:00", dayOfWeek: 1 }])} className="rounded-md border border-app-border px-3 py-2 text-sm">
          + Add day
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {schedules.map((entry, index) => (
        <div key={`custom-${index}`} className="flex gap-2">
          <input type="time" value={entry.time} onChange={(event) => updateTime(index, event.target.value)} className="flex-1 rounded-md border border-app-border bg-transparent px-3 py-2" />
          <button type="button" onClick={() => onChange(schedules.filter((_, itemIndex) => itemIndex !== index))} className="rounded-md border border-app-border px-3 py-2 text-sm" disabled={schedules.length <= 1}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...schedules, { time: "12:00" }])} className="rounded-md border border-app-border px-3 py-2 text-sm">
        + Add time
      </button>
    </div>
  );
}
