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
        "group relative overflow-hidden rounded-[1.75rem] border border-white/60 px-5 py-5 shadow-[0_14px_35px_-20px_rgba(15,35,70,0.5)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5",
        featured ? "min-h-44 sm:min-h-48" : "min-h-36",
        tintClass,
      ].join(" ")}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-current/20 bg-white/45 text-sm backdrop-blur-sm" aria-hidden="true">
        {icon}
      </div>

      <div className="mt-9">
        <p className="text-4xl font-semibold leading-none sm:text-5xl">{count}</p>
        <p className="mt-2 text-sm font-medium text-current/85">{label}</p>
      </div>

      <span className={["pointer-events-none absolute bottom-1 right-2 text-7xl leading-none opacity-20 transition-transform duration-300 group-hover:scale-110", iconClass].join(" ")} aria-hidden="true">
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
        tintClass: "bg-gradient-to-br from-[#08263f] via-[#0f6660] to-[#1a4ca2] text-white",
        iconClass: "text-white/55",
        countBy: () => true,
        featured: true,
      },
      {
        label: "Lab Results",
        count: countByCategory((category) => category === "LAB_RESULT"),
        icon: "⚗",
        tintClass: "bg-gradient-to-br from-[#f3ecfb] to-[#eadcf8] text-[#7b4bb3]",
        iconClass: "text-[#c89cf0]",
        countBy: (category) => category === "LAB_RESULT",
      },
      {
        label: "Prescription",
        count: countByCategory((category) => category === "PRESCRIPTION"),
        icon: "💊",
        tintClass: "bg-gradient-to-br from-[#e6f7ef] to-[#cdeedc] text-[#2f9368]",
        iconClass: "text-[#67c79a]",
        countBy: (category) => category === "PRESCRIPTION",
      },
      {
        label: "Radiology",
        count: countByCategory((category) => category === "IMAGING"),
        icon: "🦴",
        tintClass: "bg-gradient-to-br from-[#fdf1de] to-[#f2e2c9] text-[#b06f2d]",
        iconClass: "text-[#ebb981]",
        countBy: (category) => category === "IMAGING",
      },
      {
        label: "Discharge Summary",
        count: countByCategory((category) => category === "DISCHARGE_SUMMARY"),
        icon: "📄",
        tintClass: "bg-gradient-to-br from-[#f8eaf3] to-[#efddea] text-[#bd5f93]",
        iconClass: "text-[#e6a4cc]",
        countBy: (category) => category === "DISCHARGE_SUMMARY",
      },
      {
        label: "Insurance",
        count: countByCategory((category) => category === "INSURANCE"),
        icon: "🛡",
        tintClass: "bg-gradient-to-br from-[#ebf2ff] to-[#dce8f8] text-[#4a77ba]",
        iconClass: "text-[#95b4e9]",
        countBy: (category) => category === "INSURANCE",
      },
      {
        label: "Vaccination",
        count: countByCategory((category) => category === "VACCINATION"),
        icon: "📋",
        tintClass: "bg-gradient-to-br from-[#f8eaf3] to-[#efdeea] text-[#be628f]",
        iconClass: "text-[#e8abc9]",
        countBy: (category) => category === "VACCINATION",
      },
      {
        label: "Bill",
        count: countByCategory((category) => category === "BILLING"),
        icon: "🧾",
        tintClass: "bg-gradient-to-br from-[#f8eaf3] to-[#efdeea] text-[#be628f]",
        iconClass: "text-[#e8abc9]",
        countBy: (category) => category === "BILLING",
      },
      {
        label: "Notes",
        count: 0,
        icon: "📄",
        tintClass: "bg-gradient-to-br from-[#f8eaf3] to-[#efdeea] text-[#be628f]",
        iconClass: "text-[#e8abc9]",
        countBy: () => false,
      },
      {
        label: "Other",
        count: countByCategory((category) => category === "OTHER"),
        icon: "📄",
        tintClass: "bg-gradient-to-br from-[#f8eaf3] to-[#efdeea] text-[#be628f]",
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
      <header className="rounded-[1.75rem] border border-white/60 bg-gradient-to-r from-[#08263f] via-[#0f6660] to-[#1a4ca2] px-5 py-6 text-white shadow-[0_20px_45px_-28px_rgba(8,38,63,0.9)] sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">Health Vault</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{isCategoriesView ? "Records by category" : "Records timeline"}</h1>
        <p className="mt-2 text-sm text-white/85">Secure Medibank Storage</p>
      </header>

      <div className="relative z-20 inline-flex w-full max-w-full items-center rounded-full border border-white/70 bg-white/70 p-1.5 text-sm shadow-[0_12px_30px_-20px_rgba(15,35,70,0.6)] backdrop-blur-xl sm:w-fit">
        <button
          type="button"
          onClick={() => setViewMode("categories")}
          aria-pressed={viewMode === "categories"}
          aria-controls="records-view-panel"
          className={[
            "relative z-10 inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a4ca2]/40 sm:flex-none sm:px-8",
            viewMode === "categories" ? "bg-white text-[#11335f] shadow-sm" : "text-app-muted",
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
            "relative z-10 inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a4ca2]/40 sm:flex-none sm:px-8",
            viewMode === "timeline" ? "bg-white text-[#11335f] shadow-sm" : "text-app-muted",
          ].join(" ")}
        >
          <MenuIcon className="h-4 w-4" aria-hidden="true" />
          Timeline
        </button>
      </div>

      {!selectedProfile ? <p className="text-sm text-app-muted">Select a family profile to view records.</p> : null}
      {isLoading ? <p className="text-sm text-app-muted">Loading categories...</p> : null}

      {viewMode === "categories" ? (
        <div id="records-view-panel" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
        <div
          id="records-view-panel"
          className="space-y-4 rounded-[1.75rem] border border-white/60 bg-white/60 p-4 shadow-[0_20px_40px_-30px_rgba(15,35,70,0.9)] backdrop-blur-xl sm:p-6"
        >
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="flex min-h-12 flex-1 items-center gap-2 rounded-full border border-app-muted/15 bg-app-surface/70 px-4 shadow-inner">
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
            <div className="inline-flex min-h-12 items-center rounded-full border border-app-muted/15 bg-app-surface/70 px-4 text-sm font-semibold text-app-text">
              {selectedProfile?.fullName ?? "No profile selected"}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex min-h-12 items-center rounded-full border border-app-muted/15 bg-app-surface/70 px-4 shadow-inner">
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

            <label className="flex min-h-12 items-center gap-2 rounded-full border border-app-muted/15 bg-app-surface/70 px-4 shadow-inner">
              <CalendarIcon className="h-4 w-4 text-app-muted" aria-hidden="true" />
              <select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="w-full bg-transparent text-sm font-medium outline-none">
                <option value="ALL">Date Range</option>
                <option value="LAST_30_DAYS">Last 30 days</option>
                <option value="LAST_6_MONTHS">Last 6 months</option>
                <option value="LAST_12_MONTHS">Last 12 months</option>
              </select>
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-app-muted/10 bg-gradient-to-b from-[#f7f9fd] to-[#edf1f8] p-3 shadow-inner sm:p-6">
            <div className="border-l border-app-muted/20 pl-4 sm:pl-8">
              {timelineRecords.length === 0 ? (
                <div className="rounded-[1.25rem] border border-app-muted/10 bg-white/75 px-4 py-14 text-center backdrop-blur-sm">
                  <CalendarIcon className="mx-auto h-8 w-8 text-app-muted/45" aria-hidden="true" />
                  <h3 className="mt-4 text-3xl font-semibold text-app-text">No history found</h3>
                  <p className="mt-2 text-sm text-app-muted">No medical records available for this filter.</p>
                </div>
              ) : (
                <ol className="space-y-4">
                  {timelineRecords.map((record) => (
                    <li key={record.id} className="relative rounded-[1.15rem] border border-app-muted/15 bg-white/85 p-4 shadow-[0_12px_35px_-25px_rgba(15,35,70,0.75)]">
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
