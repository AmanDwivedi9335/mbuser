"use client";

import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";
import { useCurrentUser } from "@/features/dashboard/hooks/use-current-user";
import { ClockIcon, FileIcon, PlusIcon, UsersIcon } from "@/components/ui/icons";

export default function DashboardPage() {
  const { data, isLoading: userLoading } = useCurrentUser();
  const { selectedProfile, isLoading: profileLoading } = useCurrentProfile();

  if (userLoading || profileLoading) {
    return <p className="text-app-muted">Loading dashboard...</p>;
  }

  return (
    <section className="space-y-7">
      <div className="space-y-1">
        <h1 className="text-5xl font-bold tracking-tight text-[#10284a]">Health Overview</h1>
        <p className="text-2xl text-[#5f7392]">
          Welcome back, <span className="font-semibold text-[#112c50]">{selectedProfile?.fullName ?? data?.user.displayName ?? "You"}</span> (You)
        </p>
      </div>

      <div className="rounded-[2rem] border border-[#dce4ef] bg-white/60 p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-[#7e8faa]">
          <UsersIcon className="h-4 w-4" aria-hidden="true" />
          FAMILY MEMBERS
        </div>
        <div className="flex items-center gap-10">
          <div className="space-y-1 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3b7af0] text-4xl font-semibold text-white">
              {(data?.user.displayName ?? "A").charAt(0).toUpperCase()}
            </div>
            <p className="text-[#4d6688]">You</p>
          </div>
          <div className="space-y-1 text-center">
            <button
              type="button"
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[#b7c5d8] text-[#90a2bb]"
              aria-label="Add new family member"
            >
              <PlusIcon className="h-7 w-7" />
            </button>
            <p className="text-[#8ea0b9]">Add New</p>
          </div>
        </div>
      </div>

      <div className="max-w-md rounded-[2rem] border border-[#dce4ef] bg-white/70 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#3c557a]">Total Documents</p>
            <p className="mt-2 text-5xl font-bold text-[#0e2a52]">0</p>
            <p className="mt-1 text-[#7d91ac]">Across all family members</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3b7af0] text-white">
            <FileIcon className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-4xl font-semibold text-[#10284a]">
          <ClockIcon className="h-6 w-6 text-[#8ea2bb]" />
          Recent Activity
        </h2>
        <div className="rounded-[2rem] border border-dashed border-[#d5dfeb] bg-white/35 px-6 py-14 text-center">
          <p className="text-xl font-medium text-[#526987]">No recent documents found.</p>
          <p className="text-lg text-[#7f95b1]">Upload a record to see it here.</p>
        </div>
      </div>
    </section>
  );
}
