"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@/features/auth/schemas/zod-resolver";
import { createAppointmentSchema } from "@/features/appointments/schemas/appointment.schema";
import { createAppointment } from "@/features/appointments/services/appointments.client";

type AppointmentFormValues = {
  profileId: string;
  title: string;
  doctorName: string;
  clinicName: string;
  specialty: string;
  appointmentAt: string;
  followUpAt?: string;
};

export function AppointmentForm({ profileId, onCreated }: { profileId: string; onCreated: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<AppointmentFormValues>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      profileId,
      title: "",
      doctorName: "",
      clinicName: "",
      specialty: "",
      appointmentAt: "",
      followUpAt: "",
    },
  });

  if (!showForm) {
    return (
      <button type="button" className="rounded-md bg-app-accent px-4 py-2 text-sm font-medium text-white" onClick={() => setShowForm(true)}>
        Add appointment
      </button>
    );
  }

  return (
    <form
      className="grid gap-3 rounded-xl border border-app-border bg-app-panel p-4 md:grid-cols-2"
      onSubmit={handleSubmit(async (values) => {
        setError(null);
        try {
          await createAppointment({
            ...values,
            profileId,
            appointmentAt: new Date(values.appointmentAt).toISOString(),
            followUpAt: values.followUpAt ? new Date(values.followUpAt).toISOString() : undefined,
          });
          reset({ profileId, title: "", doctorName: "", clinicName: "", specialty: "", appointmentAt: "", followUpAt: "" });
          setShowForm(false);
          onCreated();
        } catch (requestError: unknown) {
          setError(requestError instanceof Error ? requestError.message : "Unable to create appointment");
        }
      })}
    >
      <input type="hidden" value={profileId} {...register("profileId")} />
      <input className="rounded-md border border-app-border bg-app-bg p-2" placeholder="Title" {...register("title")} />
      <input className="rounded-md border border-app-border bg-app-bg p-2" placeholder="Doctor name" {...register("doctorName")} />
      <input className="rounded-md border border-app-border bg-app-bg p-2" placeholder="Clinic name" {...register("clinicName")} />
      <input className="rounded-md border border-app-border bg-app-bg p-2" placeholder="Specialty" {...register("specialty")} />
      <label className="text-sm">
        Appointment time
        <input type="datetime-local" className="mt-1 w-full rounded-md border border-app-border bg-app-bg p-2" {...register("appointmentAt")} />
      </label>
      <label className="text-sm">
        Follow-up reminder (optional)
        <input type="datetime-local" className="mt-1 w-full rounded-md border border-app-border bg-app-bg p-2" {...register("followUpAt")} />
      </label>

      <div className="md:col-span-2 flex gap-2">
        <button type="submit" disabled={isSubmitting} className="rounded-md bg-app-accent px-4 py-2 text-sm text-white">
          {isSubmitting ? "Saving..." : "Save appointment"}
        </button>
        <button type="button" className="rounded-md border border-app-border px-4 py-2 text-sm" onClick={() => setShowForm(false)}>
          Cancel
        </button>
      </div>
      {error ? <p className="md:col-span-2 text-sm text-red-500">{error}</p> : null}
    </form>
  );
}
