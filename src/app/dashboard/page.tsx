"use client";

import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";
import { useCurrentUser } from "@/features/dashboard/hooks/use-current-user";

export default function DashboardPage() {
  const { data, isLoading: userLoading } = useCurrentUser();
  const { selectedProfile, isLoading: profileLoading } = useCurrentProfile();

  if (userLoading || profileLoading) {
    return <p className="text-app-muted">Loading dashboard...</p>;
  }

  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-bold">Welcome to Medivault</h1>
      <p className="text-app-muted">Signed in as {data?.user.displayName ?? data?.user.email ?? "User"}</p>
      <p className="text-app-muted">Current profile: {selectedProfile?.fullName ?? "No profile selected"}</p>
    </section>
  );
}
