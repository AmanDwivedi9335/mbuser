"use client";

import { useEffect, useMemo, useState } from "react";

import { FileIcon, UsersIcon } from "@/components/ui/icons";
import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";
import { useCurrentUser } from "@/features/dashboard/hooks/use-current-user";
import { listRecords } from "@/features/records/services/records.client";

type FamilyMemberPillProps = {
  label: string;
  caption: string;
  active?: boolean;
};

function FamilyMemberPill({ label, caption, active = false }: FamilyMemberPillProps) {
  return (
    <div className="flex min-w-16 flex-col items-center gap-2">
      <div
        className={
          active
            ? "flex h-14 w-14 items-center justify-center rounded-full bg-app-text text-xl font-semibold text-white"
            : "flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-app-muted/40 text-3xl text-app-muted"
        }
      >
        {label}
      </div>
      <p className="text-sm text-app-muted">{caption}</p>
    </div>
  );
}

function initialsFromName(name: string | null | undefined) {
  if (!name) {
    return "U";
  }

  const firstInitial = name.trim()[0]?.toUpperCase();
  return firstInitial ?? "U";
}

export default function DashboardPage() {
  const { data, isLoading: userLoading } = useCurrentUser();
  const { profiles, selectedProfile, isLoading: profileLoading } = useCurrentProfile();
  const [recordCount, setRecordCount] = useState(0);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);

  const currentMemberName = useMemo(() => {
    if (selectedProfile?.fullName) {
      return selectedProfile.fullName;
    }

    return data?.user.displayName ?? data?.user.email ?? "You";
  }, [data?.user.displayName, data?.user.email, selectedProfile?.fullName]);

  useEffect(() => {
    let isMounted = true;

    async function loadCount() {
      if (profiles.length === 0) {
        setRecordCount(0);
        setIsLoadingRecords(false);
        return;
      }

      setIsLoadingRecords(true);

      try {
        const responses = await Promise.all(profiles.map((profile) => listRecords({ profileId: profile.id })));
        const totalCount = responses.reduce((sum, response) => sum + response.records.length, 0);

        if (isMounted) {
          setRecordCount(totalCount);
        }
      } catch {
        if (isMounted) {
          setRecordCount(0);
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecords(false);
        }
      }
    }

    void loadCount();

    return () => {
      isMounted = false;
    };
  }, [profiles]);

  if (userLoading || profileLoading) {
    return <p className="text-app-muted">Loading dashboard...</p>;
  }

  const headerName = currentMemberName;

  return (
    <section className="space-y-7">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Health Overview</h1>
          <p className="mt-1 text-3xl text-app-muted">
            Welcome back, <span className="font-semibold text-app-text">{headerName} (You)</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-app-muted/25 bg-app-surface text-app-muted"
            aria-label="Help"
          >
            ?
          </button>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-app-text text-3xl font-semibold text-white shadow-sm">
            {initialsFromName(data?.user.displayName ?? selectedProfile?.fullName)}
          </div>
        </div>
      </header>

      <section className="rounded-4xl border border-app-muted/10 bg-app-surface p-5 shadow-[0_2px_8px_rgba(42,21,59,0.06)]">
        <p className="mb-4 inline-flex items-center gap-2 text-lg font-semibold uppercase tracking-wide text-app-muted/80">
          <UsersIcon className="h-5 w-5" aria-hidden="true" />
          Family Members
        </p>
        <div className="flex flex-wrap items-start gap-8">
          <FamilyMemberPill label={initialsFromName(currentMemberName)} caption="You" active />
          <FamilyMemberPill label="+" caption="Add New" />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="flex items-center justify-between rounded-4xl border border-app-muted/10 bg-app-surface p-6 shadow-[0_2px_8px_rgba(42,21,59,0.06)] md:max-w-md">
          <div>
            <h2 className="text-3xl font-semibold uppercase text-app-muted">Total Documents</h2>
            <p className="mt-2 text-6xl font-bold">{isLoadingRecords ? "..." : recordCount}</p>
            <p className="mt-1 text-base text-app-muted">Across all family members</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-app-text text-white">
            <FileIcon className="h-7 w-7" aria-hidden="true" />
          </div>
        </article>
      </section>

      <section className="space-y-3">
        <h2 className="inline-flex items-center gap-2 text-4xl font-semibold tracking-tight">
          <span className="text-app-muted">◷</span>
          Recent Activity
        </h2>
        <div className="rounded-4xl border border-dashed border-app-muted/30 bg-app-surface px-6 py-16 text-center">
          <p className="text-3xl text-app-muted">No recent documents found.</p>
          <p className="mt-2 text-xl text-app-muted/80">Upload a record to see it here.</p>
        </div>
      </section>
    </section>
  );
}
