"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { AddIcon, CalendarIcon, FileIcon, UsersIcon } from "@/components/ui/icons";
import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";
import { useCurrentUser } from "@/features/dashboard/hooks/use-current-user";
import { listRecords } from "@/features/records/services/records.client";

type FamilyMemberPillProps = {
  label: string;
  caption: string;
  active?: boolean;
  href?: string;
};

function FamilyMemberPill({ label, caption, active = false, href }: FamilyMemberPillProps) {
  const content = (
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

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-text">
      {content}
    </Link>
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
  const upcomingAppointments = [
    { initials: "SM", name: "Dr. Stacy Mitchell", specialty: "General Physician", dateTime: "Tomorrow · 04:00 PM" },
    { initials: "SC", name: "Dr. Sarah Chen", specialty: "Cardiologist", dateTime: "Fri · 10:00 AM" },
    { initials: "LW", name: "Dr. Lisa Wong", specialty: "Dermatologist", dateTime: "Sat · 11:30 AM" },
  ];

  const quickActions = [
    { title: "Upload Medical Records", subtitle: "Add and organize documents", href: "/dashboard/records", icon: FileIcon },
    { title: "Book Appointment", subtitle: "Schedule a visit quickly", href: "/dashboard/appointments", icon: CalendarIcon },
    { title: "Add Family Member", subtitle: "Create a new profile", href: "/dashboard/add-new", icon: AddIcon },
  ];

  return (
    <section className="space-y-6">
      <header className="rounded-4xl border border-app-muted/10 bg-gradient-to-br from-app-surface via-white to-app-surface p-5 shadow-[0_8px_30px_rgba(42,21,59,0.08)] sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-app-muted">Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-app-text">Welcome back, {headerName}</h1>
            <p className="mt-2 max-w-2xl text-sm text-app-muted sm:text-base">Here’s a simple overview of your records, appointments, and essential actions.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/add-new"
              className="inline-flex items-center gap-2 rounded-2xl bg-app-text px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(42,21,59,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_10px_28px_rgba(42,21,59,0.36)]"
            >
              <AddIcon className="h-4 w-4" aria-hidden="true" />
              Add Family Member
            </Link>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-app-text text-2xl font-semibold text-white shadow-sm">
              {initialsFromName(data?.user.displayName ?? selectedProfile?.fullName)}
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-app-muted/10 bg-app-surface p-5 shadow-[0_3px_14px_rgba(42,21,59,0.07)]">
          <p className="text-sm text-app-muted">Total Records</p>
          <p className="mt-2 text-4xl font-bold text-app-text">{isLoadingRecords ? "..." : recordCount}</p>
          <p className="mt-1 text-xs text-app-muted">Across all profiles</p>
        </article>
        <article className="rounded-3xl border border-app-muted/10 bg-app-surface p-5 shadow-[0_3px_14px_rgba(42,21,59,0.07)]">
          <p className="text-sm text-app-muted">Upcoming Appointments</p>
          <p className="mt-2 text-4xl font-bold text-app-text">{upcomingAppointments.length}</p>
          <p className="mt-1 text-xs text-app-muted">Next: {upcomingAppointments[0]?.dateTime}</p>
        </article>
        <article className="rounded-3xl border border-app-muted/10 bg-app-surface p-5 shadow-[0_3px_14px_rgba(42,21,59,0.07)]">
          <p className="text-sm text-app-muted">Shared Records</p>
          <p className="mt-2 text-4xl font-bold text-app-text">12</p>
          <p className="mt-1 text-xs text-app-muted">With 4 providers</p>
        </article>
        <article className="rounded-3xl border border-app-muted/10 bg-app-surface p-5 shadow-[0_3px_14px_rgba(42,21,59,0.07)]">
          <p className="text-sm text-app-muted">Active Family Members</p>
          <p className="mt-2 text-4xl font-bold text-app-text">{Math.max(profiles.length, 1)}</p>
          <p className="mt-1 text-xs text-app-muted">Profiles in your account</p>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <article className="rounded-4xl border border-app-muted/10 bg-app-surface p-5 shadow-[0_4px_16px_rgba(42,21,59,0.07)] sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-app-text">Upcoming Appointments</h2>
            <Link href="/dashboard/appointments/calendar" className="text-sm font-medium text-app-muted transition hover:text-app-text">
              View Calendar
            </Link>
          </div>
          <div className="space-y-2.5">
            {upcomingAppointments.map((appointment, index) => (
              <div
                key={appointment.name}
                className={
                  index === 0
                    ? "flex items-center justify-between rounded-2xl border border-app-text/20 bg-app-text/[0.05] p-3.5"
                    : "flex items-center justify-between rounded-2xl border border-app-muted/15 bg-white p-3.5"
                }
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-app-text/20 bg-app-surface font-medium text-app-text">
                    {appointment.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-app-text">{appointment.name}</p>
                    <p className="text-sm text-app-muted">{appointment.specialty}</p>
                  </div>
                </div>
                <span className="rounded-full bg-app-muted/10 px-3 py-1.5 text-xs font-medium text-app-text">{appointment.dateTime}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-4xl border border-app-muted/10 bg-app-surface p-5 shadow-[0_4px_16px_rgba(42,21,59,0.07)] sm:p-6">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight text-app-text">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="flex items-center gap-3 rounded-2xl border border-app-muted/15 bg-white p-3.5 transition hover:border-app-text/30 hover:bg-app-text/[0.03]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-app-muted/15 bg-app-surface text-app-text">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold text-app-text">{action.title}</span>
                    <span className="block text-sm text-app-muted">{action.subtitle}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </article>
      </section>

      <section className="rounded-4xl border border-app-muted/10 bg-app-surface p-4 shadow-[0_2px_8px_rgba(42,21,59,0.06)] sm:p-5">
        <p className="mb-4 inline-flex items-center gap-2 text-lg font-semibold uppercase tracking-wide text-app-muted/80">
          <UsersIcon className="h-5 w-5" aria-hidden="true" />
          Family Members
        </p>
        <div className="flex flex-wrap items-start gap-5 sm:gap-8">
          <FamilyMemberPill label={initialsFromName(currentMemberName)} caption="You" active />
          <FamilyMemberPill label="+" caption="Add New" href="/dashboard/add-new" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <span className="text-app-muted">◷</span>
          Recent Activity
        </h2>
        <div className="rounded-4xl border border-dashed border-app-muted/30 bg-app-surface px-4 py-12 text-center sm:px-6 sm:py-16">
          <p className="text-xl text-app-muted">No recent documents found.</p>
          <p className="mt-2 text-base text-app-muted/80">Upload a record to see it here.</p>
        </div>
      </section>
    </section>
  );
}
