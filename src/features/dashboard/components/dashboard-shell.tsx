"use client";

import { useState } from "react";

import { CurrentProfileProvider } from "@/features/dashboard/hooks/use-current-profile";
import { Sidebar } from "@/features/dashboard/components/sidebar";
import { Topbar } from "@/features/dashboard/components/topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <CurrentProfileProvider>
      <div className="flex min-h-screen bg-app-bg text-app-text">
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">{children}</main>
        </div>
      </div>
    </CurrentProfileProvider>
  );
}
