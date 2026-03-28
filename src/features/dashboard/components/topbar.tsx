"use client";

import { HelpIcon, MenuIcon } from "@/components/ui/icons";
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
  const { data } = useCurrentUser();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-app-bg px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-md p-2 text-app-text hover:bg-app-surface lg:hidden"
          aria-label="Open navigation menu"
        >
          <MenuIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-app-muted/30 text-app-muted"
          aria-label="Help"
        >
          <HelpIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#3c7bf1] text-2xl font-semibold text-white">
          {initialsFromName(data?.user.displayName).slice(0, 1)}
        </div>
      </div>
    </header>
  );
}
