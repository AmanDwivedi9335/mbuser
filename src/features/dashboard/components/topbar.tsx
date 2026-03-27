"use client";

import { useRouter } from "next/navigation";

import { BellIcon, LogoutIcon, MenuIcon } from "@/components/ui/icons";
import { ProfileSwitcher } from "@/features/dashboard/components/profile-switcher";
import { useCurrentUser } from "@/features/dashboard/hooks/use-current-user";

type TopbarProps = {
  onOpenMobileSidebar: () => void;
};

function initialsFromName(name: string | null | undefined) {
  if (!name) {
    return "MV";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Topbar({ onOpenMobileSidebar }: TopbarProps) {
  const router = useRouter();
  const { data } = useCurrentUser();

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-app-muted/20 bg-app-bg px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-md p-2 text-app-text hover:bg-app-surface lg:hidden"
          aria-label="Open navigation menu"
        >
          <MenuIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <div>
          <p className="text-base font-semibold">Medivault</p>
          <p className="text-xs text-app-muted">Your family health command center</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ProfileSwitcher />
        <button
          type="button"
          className="rounded-md p-2 text-app-muted hover:bg-app-surface"
          aria-label="Notifications (coming soon)"
        >
          <BellIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-app-surface text-sm font-semibold">
          {initialsFromName(data?.user.displayName)}
        </div>
        <button
          type="button"
          onClick={() => {
            void handleLogout();
          }}
          className="inline-flex items-center gap-2 rounded-md border border-app-muted/30 px-3 py-2 text-sm hover:bg-app-surface"
        >
          <LogoutIcon className="h-4 w-4" aria-hidden="true" />
          Logout
        </button>
      </div>
    </header>
  );
}
