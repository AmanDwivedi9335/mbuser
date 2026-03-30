"use client";

import { useEffect, useState } from "react";

const relationshipOptions = ["Spouse", "Mother", "Father", "Sibling", "Child", "Grandparent", "Other"];

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
      <path d="M5 7h2.2a2 2 0 0 0 1.7-.9l.8-1.2A2 2 0 0 1 11.4 4h1.2a2 2 0 0 1 1.7.9l.8 1.2a2 2 0 0 0 1.7.9H19a2 2 0 0 1 2 2v8.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5V9a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

export function AddFamilyMemberModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    relationship: "",
    age: "",
    email: "",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex h-full min-h-[370px] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-app-border bg-app-surface px-4 text-app-muted transition-colors hover:border-app-accent/60 hover:text-app-accent sm:gap-4 sm:px-6"
      >
        <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-white text-6xl leading-none shadow-[0_8px_16px_rgba(79,101,131,0.12)] sm:h-[5.5rem] sm:w-[5.5rem] sm:text-7xl">+</span>
        <span className="text-center text-xl font-semibold sm:text-2xl">Link Family Member</span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0b1a2d]/40 p-3 backdrop-blur-[3px] sm:items-center sm:p-6" role="presentation" onClick={() => setIsOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-family-member-title"
            className="max-h-[92vh] w-full max-w-[760px] overflow-auto rounded-[28px] bg-white text-app-text shadow-[0_22px_42px_rgba(17,35,63,0.28)] sm:rounded-[40px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-[#eef1f6] px-4 py-4 sm:px-8 sm:py-6">
              <h2 id="add-family-member-title" className="text-xl font-bold text-app-text sm:text-2xl">
                Add Family Member
              </h2>
              <button type="button" aria-label="Close add family member dialog" className="rounded-full p-2 text-[#6d7f99] transition-colors hover:bg-[#dfe5ee]" onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-5 sm:space-y-5 sm:px-8 sm:py-7" onSubmit={(event) => event.preventDefault()}>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="relative flex h-[7.5rem] w-[7.5rem] items-center justify-center rounded-full border border-[#d9e1ec] bg-[#edf2f7] text-[#8ca0ba]"
                  aria-label="Add family member photo"
                >
                  <CameraIcon />
                  <span className="absolute bottom-1 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#3d80f4] text-2xl font-semibold text-white">+</span>
                </button>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-app-muted">Full Name</span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  placeholder="e.g. Jane Doe"
                  className="h-16 w-full rounded-full border border-[#ccd8e7] px-6 text-xl text-app-text outline-none transition-colors placeholder:text-app-muted focus:border-[#8eaae0]"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-[1fr_0.85fr]">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-app-muted">Relation</span>
                  <select
                    value={form.relationship}
                    onChange={(event) => setForm((prev) => ({ ...prev, relationship: event.target.value }))}
                    className="h-16 w-full rounded-full border border-[#ccd8e7] bg-white px-6 text-xl text-app-text outline-none transition-colors focus:border-[#8eaae0]"
                  >
                    <option value="">Select...</option>
                    {relationshipOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-app-muted">Age</span>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={form.age}
                    onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
                    placeholder="Age"
                    className="h-16 w-full rounded-full border border-[#ccd8e7] px-6 text-xl text-app-text outline-none transition-colors placeholder:text-app-muted focus:border-[#8eaae0]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold tracking-wide text-app-muted">
                  EMAIL <span className="font-normal lowercase">(optional)</span>
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="user@example.com"
                  className="h-16 w-full rounded-full border border-[#ccd8e7] px-6 text-xl text-app-text outline-none transition-colors placeholder:text-app-muted focus:border-[#8eaae0]"
                />
              </label>

              <button type="submit" className="h-16 w-full rounded-full bg-[#2f67e6] text-2xl font-semibold text-white shadow-[0_8px_16px_rgba(47,103,230,0.34)] transition-colors hover:bg-[#2358cf]">
                Add Member
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
