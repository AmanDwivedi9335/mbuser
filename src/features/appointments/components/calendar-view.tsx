"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { AppointmentItem } from "@/features/appointments/types/appointment.types";

function dayKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function CalendarView({ appointments }: { appointments: AppointmentItem[] }) {
  const [monthCursor, setMonthCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const calendarDays = useMemo(() => {
    const start = new Date(monthCursor);
    start.setDate(1 - start.getDay());

    return Array.from({ length: 42 }, (_, idx) => {
      const day = new Date(start);
      day.setDate(start.getDate() + idx);
      return day;
    });
  }, [monthCursor]);

  const appointmentsByDay = useMemo(() => {
    return appointments.reduce<Record<string, AppointmentItem[]>>((acc, appointment) => {
      const key = dayKey(new Date(appointment.appointmentAt));
      acc[key] = [...(acc[key] ?? []), appointment];
      return acc;
    }, {});
  }, [appointments]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <button type="button" className="rounded-md border border-app-border px-3 py-2 text-sm" onClick={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>Previous</button>
        <h2 className="text-lg font-semibold">{monthCursor.toLocaleString([], { month: "long", year: "numeric" })}</h2>
        <button type="button" className="rounded-md border border-app-border px-3 py-2 text-sm" onClick={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>Next</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-app-muted">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => <p key={label} className="px-1">{label}</p>)}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const key = dayKey(day);
          const items = appointmentsByDay[key] ?? [];
          const isCurrentMonth = day.getMonth() === monthCursor.getMonth();

          return (
            <div key={key} className={`min-h-24 rounded-md border border-app-border p-2 ${isCurrentMonth ? "bg-app-panel" : "bg-app-bg opacity-70"}`}>
              <p className="text-xs text-app-muted">{day.getDate()}</p>
              <div className="mt-1 space-y-1">
                {items.slice(0, 2).map((appointment) => (
                  <Link key={appointment.id} href={`/dashboard/appointments/${appointment.id}`} className="block truncate rounded bg-blue-500/20 px-1 py-0.5 text-[11px] text-blue-300">
                    {appointment.title}
                  </Link>
                ))}
                {items.length > 2 ? <p className="text-[11px] text-app-muted">+{items.length - 2} more</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
