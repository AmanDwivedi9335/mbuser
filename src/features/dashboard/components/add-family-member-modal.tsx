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
        className="group flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-[34px] border-2 border-dashed border-[#d6deeb] bg-[#f4f7fb] text-[#8ba0bf] transition-colors hover:border-[#98b4e5] hover:text-[#5f7fb1]"
      >
        <span className="flex h-22 w-22 items-center justify-center rounded-full bg-white text-7xl leading-none shadow-[0_8px_16px_rgba(79,101,131,0.12)]">+</span>
        <span className="text-[42px] font-medium">Link Family Member</span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1a2d]/40 p-6 backdrop-blur-[3px]" role="presentation" onClick={() => setIsOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-family-member-title"
            className="w-full max-w-[760px] overflow-hidden rounded-[40px] bg-white shadow-[0_22px_42px_rgba(17,35,63,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-[#eef1f6] px-8 py-6">
              <h2 id="add-family-member-title" className="text-[44px] font-semibold text-[#0d284f]">
                Add Family Member
              </h2>
              <button type="button" aria-label="Close add family member dialog" className="rounded-full p-2 text-[#6d7f99] transition-colors hover:bg-[#dfe5ee]" onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-5 px-8 py-7" onSubmit={(event) => event.preventDefault()}>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="relative flex h-30 w-30 items-center justify-center rounded-full border border-[#d9e1ec] bg-[#edf2f7] text-[#8ca0ba]"
                  aria-label="Add family member photo"
                >
                  <CameraIcon />
                  <span className="absolute bottom-1 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#3d80f4] text-2xl font-semibold text-white">+</span>
                </button>
              </div>

              <label className="block">
                <span className="mb-2 block text-xl font-semibold uppercase tracking-wide text-[#5e7391]">Full Name</span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  placeholder="e.g. Jane Doe"
                  className="h-16 w-full rounded-full border border-[#ccd8e7] px-6 text-[36px] text-[#223f67] outline-none transition-colors placeholder:text-[#8aa0be] focus:border-[#8eaae0]"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-[1fr_0.85fr]">
                <label className="block">
                  <span className="mb-2 block text-xl font-semibold uppercase tracking-wide text-[#5e7391]">Relation</span>
                  <select
                    value={form.relationship}
                    onChange={(event) => setForm((prev) => ({ ...prev, relationship: event.target.value }))}
                    className="h-16 w-full rounded-full border border-[#ccd8e7] bg-white px-6 text-[36px] text-[#223f67] outline-none transition-colors focus:border-[#8eaae0]"
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
                  <span className="mb-2 block text-xl font-semibold uppercase tracking-wide text-[#5e7391]">Age</span>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={form.age}
                    onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
                    placeholder="Age"
                    className="h-16 w-full rounded-full border border-[#ccd8e7] px-6 text-[36px] text-[#223f67] outline-none transition-colors placeholder:text-[#8aa0be] focus:border-[#8eaae0]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xl font-semibold tracking-wide text-[#5e7391]">
                  EMAIL <span className="font-normal lowercase">(optional)</span>
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="user@example.com"
                  className="h-16 w-full rounded-full border border-[#ccd8e7] px-6 text-[36px] text-[#223f67] outline-none transition-colors placeholder:text-[#8aa0be] focus:border-[#8eaae0]"
                />
              </label>

              <button type="submit" className="h-16 w-full rounded-full bg-[#2f67e6] text-[42px] font-semibold text-white shadow-[0_8px_16px_rgba(47,103,230,0.34)] transition-colors hover:bg-[#2358cf]">
                Add Member
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
