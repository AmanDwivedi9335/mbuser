"use client";

import { useState } from "react";

export function RecordFilters({
  onSearch,
  disabled,
}: {
  onSearch: (query: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        void onSearch(query);
      }}
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-md border border-app-border bg-transparent px-3 py-2 text-sm outline-none ring-app-accent focus:ring-2"
        placeholder="Search title, notes, extracted text"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-md bg-app-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        Search
      </button>
    </form>
  );
}
