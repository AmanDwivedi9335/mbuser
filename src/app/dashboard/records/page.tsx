"use client";

import { useMemo } from "react";

import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";
import { useRecords } from "@/features/records/hooks/use-records";

type CategoryCardConfig = {
  label: string;
  count: number;
  icon: string;
  tintClass: string;
  iconClass: string;
  countBy: (recordCategory: string) => boolean;
  featured?: boolean;
};

function CategoryCard({ label, count, icon, tintClass, iconClass, featured = false }: Omit<CategoryCardConfig, "countBy">) {
  return (
    <article
      className={[
        "relative overflow-hidden rounded-3xl px-5 py-4",
        featured ? "min-h-44" : "min-h-36",
        tintClass,
      ].join(" ")}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-current/20 bg-white/40 text-sm" aria-hidden="true">
        {icon}
      </div>

      <div className="mt-8">
        <p className="text-5xl font-bold leading-none">{count}</p>
        <p className="mt-1 text-sm font-semibold text-current/85">{label}</p>
      </div>

      <span className={["pointer-events-none absolute bottom-1 right-2 text-7xl leading-none opacity-25", iconClass].join(" ")} aria-hidden="true">
        {icon}
      </span>
    </article>
  );
}

export default function RecordsPage() {
  const { selectedProfile } = useCurrentProfile();
  const { records, isLoading } = useRecords(selectedProfile?.id ?? null);

  const categoryCards = useMemo<CategoryCardConfig[]>(() => {
    const countByCategory = (countBy: (recordCategory: string) => boolean) => records.filter((record) => countBy(record.category)).length;

    return [
      {
        label: "All Event Categories",
        count: records.length,
        icon: "◻",
        tintClass: "bg-gradient-to-r from-[#08263f] via-[#0f6660] to-[#1a4ca2] text-white",
        iconClass: "text-white/55",
        countBy: () => true,
        featured: true,
      },
      {
        label: "Lab Results",
        count: countByCategory((category) => category === "LAB_RESULT"),
        icon: "⚗",
        tintClass: "bg-[#eadcf8] text-[#7b4bb3]",
        iconClass: "text-[#c89cf0]",
        countBy: (category) => category === "LAB_RESULT",
      },
      {
        label: "Prescription",
        count: countByCategory((category) => category === "PRESCRIPTION"),
        icon: "💊",
        tintClass: "bg-[#cdeedc] text-[#2f9368]",
        iconClass: "text-[#67c79a]",
        countBy: (category) => category === "PRESCRIPTION",
      },
      {
        label: "Radiology",
        count: countByCategory((category) => category === "IMAGING"),
        icon: "🦴",
        tintClass: "bg-[#f2e2c9] text-[#b06f2d]",
        iconClass: "text-[#ebb981]",
        countBy: (category) => category === "IMAGING",
      },
      {
        label: "Discharge Summary",
        count: countByCategory((category) => category === "DISCHARGE_SUMMARY"),
        icon: "📄",
        tintClass: "bg-[#efddea] text-[#bd5f93]",
        iconClass: "text-[#e6a4cc]",
        countBy: (category) => category === "DISCHARGE_SUMMARY",
      },
      {
        label: "Insurance",
        count: countByCategory((category) => category === "INSURANCE"),
        icon: "🛡",
        tintClass: "bg-[#dce8f8] text-[#4a77ba]",
        iconClass: "text-[#95b4e9]",
        countBy: (category) => category === "INSURANCE",
      },
      {
        label: "Vaccination",
        count: countByCategory((category) => category === "VACCINATION"),
        icon: "📋",
        tintClass: "bg-[#efdeea] text-[#be628f]",
        iconClass: "text-[#e8abc9]",
        countBy: (category) => category === "VACCINATION",
      },
      {
        label: "Bill",
        count: countByCategory((category) => category === "BILLING"),
        icon: "🧾",
        tintClass: "bg-[#efdeea] text-[#be628f]",
        iconClass: "text-[#e8abc9]",
        countBy: (category) => category === "BILLING",
      },
      {
        label: "Notes",
        count: 0,
        icon: "📄",
        tintClass: "bg-[#efdeea] text-[#be628f]",
        iconClass: "text-[#e8abc9]",
        countBy: () => false,
      },
      {
        label: "Other",
        count: countByCategory((category) => category === "OTHER"),
        icon: "📄",
        tintClass: "bg-[#efdeea] text-[#be628f]",
        iconClass: "text-[#e8abc9]",
        countBy: (category) => category === "OTHER",
      },
    ];
  }, [records]);

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-app-text">Categories</h1>
        <p className="text-sm text-app-muted">Secure MediVault Storage</p>
      </header>

      <div className="inline-flex items-center rounded-full border border-app-muted/20 bg-white/70 p-1 text-sm">
        <button type="button" className="rounded-full bg-app-surface px-12 py-2 font-semibold text-app-text">
          Categories
        </button>
        <button type="button" className="rounded-full px-12 py-2 text-app-muted">
          Timeline
        </button>
      </div>

      {!selectedProfile ? <p className="text-sm text-app-muted">Select a family profile to view records.</p> : null}
      {isLoading ? <p className="text-sm text-app-muted">Loading categories...</p> : null}

      <div className="grid gap-2 md:grid-cols-2">
        {categoryCards.map((card) => (
          <CategoryCard
            key={card.label}
            label={card.label}
            count={card.count}
            icon={card.icon}
            tintClass={card.tintClass}
            iconClass={card.iconClass}
            featured={card.featured}
          />
        ))}
      </div>
    </section>
  );
}
