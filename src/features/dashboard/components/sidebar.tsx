"use client";

import {
  AddIcon,
  CalendarIcon,
  CloseIcon,
  FileIcon,
  HeartIcon,
  HomeIcon,
  PillIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { NavItem } from "@/features/dashboard/components/nav-item";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/dashboard/add-new", label: "Family", icon: AddIcon },
  // { href: "/dashboard/profiles", label: "Profiles", icon: UsersIcon },
  { href: "/dashboard/records", label: "Records", icon: FileIcon },
  // { href: "/dashboard/medications", label: "Medications", icon: PillIcon },
  // { href: "/dashboard/appointments", label: "Appointments", icon: CalendarIcon },
  // { href: "/dashboard/vitals", label: "Vitals", icon: HeartIcon },
  // { href: "/dashboard/insurance", label: "Insurance", icon: ShieldIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

type SidebarProps = {
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-app-muted/20 bg-app-bg p-4 lg:block lg:h-screen lg:sticky lg:top-0">
        <div className="mb-6 px-3 text-lg font-semibold">Medivault</div>
        <nav className="space-y-1" aria-label="Dashboard navigation">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>
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
          <span className="text-lg font-semibold">Medivault</span>
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
