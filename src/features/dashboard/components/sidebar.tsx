"use client";

import {
  CalendarIcon,
  CloseIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  PulseIcon,
} from "@/components/ui/icons";
import { NavItem } from "@/features/dashboard/components/nav-item";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/dashboard/records", label: "Records", icon: FolderIcon },
  { href: "/dashboard/profiles", label: "Family", icon: UsersIcon },
  { href: "/dashboard/vitals", label: "Analytics", icon: PulseIcon },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarIcon },
];

type SidebarProps = {
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-app-muted/20 bg-app-bg p-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="mb-8 px-3 pt-2 text-4xl font-semibold tracking-tight">MediVault</div>
        <nav className="space-y-1" aria-label="Dashboard navigation">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>
        <button type="button" className="mt-auto hidden w-full rounded-full bg-[#12baa9] px-5 py-3 text-lg font-semibold text-white shadow-sm lg:block">
          Upload Record
        </button>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onCloseMobile} aria-hidden="true" />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-app-muted/20 bg-app-bg p-4 shadow-lg transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Mobile dashboard navigation"
      >
        <div className="mb-6 flex items-center justify-between px-3">
          <span className="text-lg font-semibold">MediVault</span>
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-md p-1 text-app-muted hover:bg-app-surface"
            aria-label="Close navigation menu"
          >
            <CloseIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav className="space-y-1" aria-label="Dashboard navigation">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} onClick={onCloseMobile} />
          ))}
        </nav>
      </aside>
    </>
  );
}
