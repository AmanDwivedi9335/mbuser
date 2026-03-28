"use client";

import { useState } from "react";

import { createFollowUp } from "@/features/appointments/services/appointments.client";

export function FollowUpForm({ appointmentId, onCreated }: { appointmentId: string; onCreated: () => void }) {
  const [followUpAt, setFollowUpAt] = useState("");
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"appointment" | "reminder">("appointment");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3 rounded-xl border border-app-border bg-app-panel p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);

        try {
          await createFollowUp({
            appointmentId,
            mode,
            followUpAt: new Date(followUpAt).toISOString(),
            title: title || undefined,
          });
          setFollowUpAt("");
          setTitle("");
          onCreated();
        } catch (requestError: unknown) {
          setError(requestError instanceof Error ? requestError.message : "Unable to create follow-up");
        }
      }}
    >
      <h2 className="text-lg font-semibold">Create follow-up</h2>

      <div className="flex gap-2 text-sm">
        <button type="button" onClick={() => setMode("appointment")} className={`rounded-md px-3 py-2 ${mode === "appointment" ? "bg-app-accent text-white" : "border border-app-border"}`}>
          Appointment
        </button>
        <button type="button" onClick={() => setMode("reminder")} className={`rounded-md px-3 py-2 ${mode === "reminder" ? "bg-app-accent text-white" : "border border-app-border"}`}>
          Reminder only
        </button>
      </div>

      {mode === "appointment" ? <input className="w-full rounded-md border border-app-border bg-app-bg p-2" placeholder="Follow-up title (optional)" value={title} onChange={(event) => setTitle(event.target.value)} /> : null}

      <label className="text-sm">
        Follow-up date/time
        <input required type="datetime-local" className="mt-1 w-full rounded-md border border-app-border bg-app-bg p-2" value={followUpAt} onChange={(event) => setFollowUpAt(event.target.value)} />
      </label>

      <button type="submit" className="rounded-md bg-app-accent px-4 py-2 text-sm text-white">Save follow-up</button>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </form>
  );
}
