"use client";

import { useState } from "react";

import { addAppointmentNote } from "@/features/appointments/services/appointments.client";
import type { AppointmentNoteItem } from "@/features/appointments/types/appointment.types";

export function AppointmentNotes({ appointmentId, notes, onAdded }: { appointmentId: string; notes: AppointmentNoteItem[]; onAdded: () => void }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="space-y-3 rounded-xl border border-app-border bg-app-panel p-4">
      <h2 className="text-lg font-semibold">Visit notes</h2>

      <div className="space-y-2">
        {notes.length === 0 ? <p className="text-sm text-app-muted">No notes yet.</p> : null}
        {notes.map((note) => (
          <article key={note.id} className="rounded-md border border-app-border p-3 text-sm">
            <p>{note.content}</p>
            <p className="mt-1 text-xs text-app-muted">{new Date(note.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </div>

      <form
        className="space-y-2"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          try {
            await addAppointmentNote({ appointmentId, content });
            setContent("");
            onAdded();
          } catch (requestError: unknown) {
            setError(requestError instanceof Error ? requestError.message : "Unable to add note");
          }
        }}
      >
        <textarea className="w-full rounded-md border border-app-border bg-app-bg p-2" rows={4} value={content} onChange={(event) => setContent(event.target.value)} placeholder="Add consultation notes..." />
        <button type="submit" className="rounded-md bg-app-accent px-4 py-2 text-sm text-white">Add note</button>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </form>
    </section>
  );
}
