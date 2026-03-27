"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { IconComponent } from "@/components/ui/icons";

type NavItemProps = {
  href: string;
  label: string;
  icon: IconComponent;
  onClick?: () => void;
};

export function NavItem({ href, label, icon: Icon, onClick }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-app-text text-app-bg" : "text-app-text hover:bg-app-surface",
      ].join(" ")}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
