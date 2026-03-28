import Link from "next/link";

import { updateAppointmentStatus } from "@/features/appointments/services/appointments.client";
import type { AppointmentItem } from "@/features/appointments/types/appointment.types";
import { AppointmentStatusBadge } from "@/features/appointments/components/appointment-status-badge";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AppointmentCard({ appointment, onUpdated }: { appointment: AppointmentItem; onUpdated: () => void }) {
  return (
    <article className={`space-y-3 rounded-xl border border-app-border bg-app-panel p-4 ${appointment.isToday ? "ring-1 ring-blue-400/40" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-app-muted">{appointment.specialty}</p>
          <h3 className="text-base font-semibold">{appointment.title}</h3>
          <p className="text-sm">Dr. {appointment.doctorName} • {appointment.clinicName}</p>
        </div>
        <AppointmentStatusBadge status={appointment.status} />
      </div>

      <p className="text-sm text-app-muted">{formatDateTime(appointment.appointmentAt)}</p>
      {appointment.overdueFollowUp ? <p className="text-xs text-amber-400">Follow-up is overdue.</p> : null}

      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/dashboard/appointments/${appointment.id}`} className="rounded-md border border-app-border px-3 py-2 text-sm">
          View details
        </Link>

        {appointment.status === "UPCOMING" ? (
          <>
            <button
              type="button"
              className="rounded-md bg-emerald-500/20 px-3 py-2 text-sm text-emerald-300"
              onClick={async () => {
                await updateAppointmentStatus({ appointmentId: appointment.id, status: "COMPLETED" });
                onUpdated();
              }}
            >
              Mark completed
            </button>
            <button
              type="button"
              className="rounded-md bg-red-500/20 px-3 py-2 text-sm text-red-300"
              onClick={async () => {
                await updateAppointmentStatus({ appointmentId: appointment.id, status: "CANCELLED" });
                onUpdated();
              }}
            >
              Cancel
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}
