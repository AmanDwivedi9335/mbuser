"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { AppointmentNotes } from "@/features/appointments/components/appointment-notes";
import { AppointmentStatusBadge } from "@/features/appointments/components/appointment-status-badge";
import { FollowUpForm } from "@/features/appointments/components/follow-up-form";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";
import { updateAppointmentStatus } from "@/features/appointments/services/appointments.client";

export default function AppointmentDetailPage() {
  const params = useParams<{ id: string }>();
  const { appointment, isLoading, error, refresh } = useAppointment(params.id);

  if (isLoading) {
    return <p className="text-sm text-app-muted">Loading appointment...</p>;
  }

  if (error || !appointment) {
    return <p className="text-sm text-red-500">{error ?? "Appointment not found"}</p>;
  }

  return (
    <section className="space-y-5">
      <Link href="/dashboard/appointments" className="inline-block rounded-md border border-app-border px-3 py-2 text-sm">
        Back to appointments
      </Link>

      <article className="space-y-3 rounded-xl border border-app-border bg-app-panel p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-app-muted">{appointment.specialty}</p>
            <h1 className="text-2xl font-bold">{appointment.title}</h1>
            <p className="text-sm">Dr. {appointment.doctorName} • {appointment.clinicName}</p>
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </div>

        <p className="text-sm text-app-muted">{new Date(appointment.appointmentAt).toLocaleString()}</p>

        <div className="flex flex-wrap gap-2">
          {appointment.status !== "COMPLETED" ? (
            <button type="button" className="rounded-md bg-emerald-500/20 px-3 py-2 text-sm text-emerald-300" onClick={async () => {
              await updateAppointmentStatus({ appointmentId: appointment.id, status: "COMPLETED" });
              void refresh();
            }}>
              Mark completed
            </button>
          ) : null}
          {appointment.status !== "CANCELLED" ? (
            <button type="button" className="rounded-md bg-red-500/20 px-3 py-2 text-sm text-red-300" onClick={async () => {
              await updateAppointmentStatus({ appointmentId: appointment.id, status: "CANCELLED" });
              void refresh();
            }}>
              Cancel appointment
            </button>
          ) : null}
        </div>
      </article>

      <AppointmentNotes appointmentId={appointment.id} notes={appointment.appointmentNotes} onAdded={() => void refresh()} />
      <FollowUpForm appointmentId={appointment.id} onCreated={() => void refresh()} />

      <section className="space-y-2 rounded-xl border border-app-border bg-app-panel p-4">
        <h2 className="text-lg font-semibold">Follow-up history</h2>
        {appointment.followUps.length === 0 ? <p className="text-sm text-app-muted">No follow-up appointments yet.</p> : null}
        {appointment.followUps.map((followUp) => (
          <Link key={followUp.id} href={`/dashboard/appointments/${followUp.id}`} className="block rounded-md border border-app-border p-3 text-sm">
            {followUp.title} • {new Date(followUp.appointmentAt).toLocaleString()}
          </Link>
        ))}
      </section>
    </section>
  );
}
