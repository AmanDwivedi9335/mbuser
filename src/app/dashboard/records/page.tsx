"use client";

import { useMemo, useState } from "react";

import { CalendarIcon, FileIcon, MenuIcon } from "@/components/ui/icons";
import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";
import { useRecords } from "@/features/records/hooks/use-records";

type ViewMode = "categories" | "timeline";

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

const categoryLabelByValue: Record<string, string> = {
  LAB_RESULT: "Lab Results",
  PRESCRIPTION: "Prescription",
  VACCINATION: "Vaccination",
  IMAGING: "Radiology",
  DISCHARGE_SUMMARY: "Discharge Summary",
  BILLING: "Bill",
  INSURANCE: "Insurance",
  OTHER: "Other",
};

function formatRecordDate(dateValue: string | null) {
  if (!dateValue) {
    return "No date";
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export default function RecordsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState("ALL");

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

  const uniqueDoctors = useMemo(() => {
    const doctors = records.map((record) => record.providerName).filter((providerName): providerName is string => Boolean(providerName));
    return Array.from(new Set(doctors)).sort((a, b) => a.localeCompare(b));
  }, [records]);

  const timelineRecords = useMemo(() => {
    const now = Date.now();

    const inDateRange = (dateValue: string | null) => {
      if (dateRange === "ALL") {
        return true;
      }

      if (!dateValue) {
        return false;
      }

      const recordMs = new Date(dateValue).getTime();
      if (Number.isNaN(recordMs)) {
        return false;
      }

      if (dateRange === "LAST_30_DAYS") {
        return recordMs >= now - 30 * 24 * 60 * 60 * 1000;
      }

      if (dateRange === "LAST_6_MONTHS") {
        return recordMs >= now - 183 * 24 * 60 * 60 * 1000;
      }

      if (dateRange === "LAST_12_MONTHS") {
        return recordMs >= now - 365 * 24 * 60 * 60 * 1000;
      }

      return true;
    };

    const matchesSearch = (value: string | null) => (value ?? "").toLowerCase().includes(searchQuery.trim().toLowerCase());

    return records
      .filter((record) => {
        const matchesDoctor = doctorFilter === "ALL" || record.providerName === doctorFilter;
        const searchable = [record.title, record.notes, record.providerName, categoryLabelByValue[record.category]];
        const matchesText =
          searchQuery.trim().length === 0 ||
          searchable.some((entry) => matchesSearch(entry)) ||
          record.tags.some((tag) => tag.toLowerCase().includes(searchQuery.trim().toLowerCase()));

        return matchesDoctor && inDateRange(record.recordDate) && matchesText;
      })
      .sort((a, b) => {
        const aDate = new Date(a.recordDate ?? a.createdAt).getTime();
        const bDate = new Date(b.recordDate ?? b.createdAt).getTime();
        return bDate - aDate;
      });
  }, [records, doctorFilter, dateRange, searchQuery]);

  const isCategoriesView = viewMode === "categories";

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-app-text">{isCategoriesView ? "Categories" : "Timeline"}</h1>
        <p className="text-sm text-app-muted">Secure Medibank Storage</p>
      </header>

      <div className="relative z-20 inline-flex w-full max-w-full items-center rounded-full border border-app-muted/20 bg-white/70 p-1 text-sm shadow-sm sm:w-fit">
        <button
          type="button"
          onClick={() => setViewMode("categories")}
          aria-pressed={viewMode === "categories"}
          aria-controls="records-view-panel"
          className={[
            "relative z-10 inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a4ca2]/40 sm:flex-none sm:px-8",
            viewMode === "categories" ? "bg-app-surface text-app-text" : "text-app-muted",
          ].join(" ")}
        >
          <FileIcon className="h-4 w-4" aria-hidden="true" />
          Categories
        </button>
        <button
          type="button"
          onClick={() => setViewMode("timeline")}
          aria-pressed={viewMode === "timeline"}
          aria-controls="records-view-panel"
          className={[
            "relative z-10 inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a4ca2]/40 sm:flex-none sm:px-8",
            viewMode === "timeline" ? "bg-app-surface text-app-text" : "text-app-muted",
          ].join(" ")}
        >
          <MenuIcon className="h-4 w-4" aria-hidden="true" />
          Timeline
        </button>
      </div>

      {!selectedProfile ? <p className="text-sm text-app-muted">Select a family profile to view records.</p> : null}
      {isLoading ? <p className="text-sm text-app-muted">Loading categories...</p> : null}

      {viewMode === "categories" ? (
        <div id="records-view-panel" className="grid gap-2 md:grid-cols-2">
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
      ) : (
        <div id="records-view-panel" className="space-y-3 rounded-3xl border border-app-muted/15 bg-white/40 p-4 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="flex min-h-11 flex-1 items-center gap-2 rounded-full border border-app-muted/15 bg-app-surface/55 px-4">
              <span className="text-app-muted" aria-hidden="true">
                🔎
              </span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <div className="inline-flex min-h-11 items-center rounded-full border border-app-muted/15 bg-app-surface/55 px-4 text-sm font-semibold">
              {selectedProfile?.label ?? "No profile selected"}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex min-h-11 items-center rounded-full border border-app-muted/15 bg-app-surface/55 px-4">
              <select
                value={doctorFilter}
                onChange={(event) => setDoctorFilter(event.target.value)}
                className="w-full bg-transparent text-sm font-medium outline-none"
              >
                <option value="ALL">All Doctors</option>
                {uniqueDoctors.map((doctor) => (
                  <option key={doctor} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex min-h-11 items-center gap-2 rounded-full border border-app-muted/15 bg-app-surface/55 px-4">
              <CalendarIcon className="h-4 w-4 text-app-muted" aria-hidden="true" />
              <select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="w-full bg-transparent text-sm font-medium outline-none">
                <option value="ALL">Date Range</option>
                <option value="LAST_30_DAYS">Last 30 days</option>
                <option value="LAST_6_MONTHS">Last 6 months</option>
                <option value="LAST_12_MONTHS">Last 12 months</option>
              </select>
            </label>
          </div>

          <div className="rounded-3xl border border-app-muted/15 bg-[#edf1f8] p-3 sm:p-6">
            <div className="border-l border-app-muted/20 pl-4 sm:pl-8">
              {timelineRecords.length === 0 ? (
                <div className="rounded-3xl border border-app-muted/10 bg-white/60 px-4 py-14 text-center">
                  <CalendarIcon className="mx-auto h-8 w-8 text-app-muted/45" aria-hidden="true" />
                  <h3 className="mt-4 text-3xl font-semibold text-app-text">No history found</h3>
                  <p className="mt-2 text-sm text-app-muted">No medical records available for this filter.</p>
                </div>
              ) : (
                <ol className="space-y-4">
                  {timelineRecords.map((record) => (
                    <li key={record.id} className="relative rounded-2xl border border-app-muted/15 bg-white/75 p-4">
                      <span className="absolute -left-[2.15rem] top-6 h-3 w-3 rounded-full bg-[#1a4ca2]" aria-hidden="true" />
                      <p className="text-xs font-semibold uppercase tracking-wide text-app-muted">{categoryLabelByValue[record.category] ?? "Record"}</p>
                      <h3 className="mt-1 text-base font-semibold text-app-text">{record.title}</h3>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-app-muted">
                        <span>{record.providerName ?? "Unknown doctor"}</span>
                        <span>{formatRecordDate(record.recordDate)}</span>
                      </div>
                      {record.notes ? <p className="mt-2 text-sm text-app-muted">{record.notes}</p> : null}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
