"use client";

import { useMemo, useState } from "react";

import { DirectionIcon, PhoneIcon } from "@/components/ui/icons";

type NearbyCategory = "Doctors" | "Labs" | "Hospitals";

type NearbyPlace = {
  name: string;
  distance: string;
  eta: string;
  address: string;
};

const PLACE_DATA: Record<NearbyCategory, NearbyPlace[]> = {
  Doctors: [
    { name: "Dr. Olivia Carter", distance: "0.8 mi", eta: "6 min", address: "125 Maple Ave" },
    { name: "Dr. Ethan Moore", distance: "1.4 mi", eta: "10 min", address: "44 Harbor Road" },
    { name: "Dr. Amelia Shaw", distance: "2.2 mi", eta: "13 min", address: "290 Cedar Street" },
  ],
  Labs: [
    { name: "HealthFirst Diagnostics", distance: "0.9 mi", eta: "7 min", address: "31 Garden Plaza" },
    { name: "CityCare Lab Center", distance: "1.7 mi", eta: "11 min", address: "82 Lake Point Blvd" },
    { name: "PrimePath Labs", distance: "2.3 mi", eta: "14 min", address: "210 Market Street" },
  ],
  Hospitals: [
    { name: "Mercy General Hospital", distance: "1.2 mi", eta: "8 min", address: "12 Wellness Drive" },
    { name: "Northside Medical Center", distance: "2.8 mi", eta: "16 min", address: "550 Sunrise Way" },
    { name: "St. Helena Community", distance: "3.4 mi", eta: "19 min", address: "400 Ivy Circle" },
  ],
};

const CATEGORY_ORDER: NearbyCategory[] = ["Doctors", "Labs", "Hospitals"];

type NearbyMenuProps = {
  className?: string;
};

export function NearbyMenu({ className }: NearbyMenuProps) {
  const [activeCategory, setActiveCategory] = useState<NearbyCategory>("Doctors");
  const activePlaces = useMemo(() => PLACE_DATA[activeCategory], [activeCategory]);

  return (
    <section className={["rounded-2xl border border-app-muted/20 bg-app-surface/70 p-3", className].filter(Boolean).join(" ")}>
      <div className="mb-3">
        <p className="text-sm font-semibold text-app-text">Near By</p>
        <p className="text-xs text-app-muted">Find care around you with quick actions.</p>
      </div>

      <div className="mb-3 grid grid-cols-3 rounded-xl bg-app-bg/80 p-1" role="tablist" aria-label="Nearby categories">
        {CATEGORY_ORDER.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(category)}
              className={[
                "rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-all",
                isActive ? "bg-gradient-to-r from-fuchsia-600 to-violet-700 text-white shadow-sm" : "text-app-muted hover:text-app-text",
              ].join(" ")}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {activePlaces.map((place) => (
          <article key={place.name} className="rounded-xl border border-app-muted/15 bg-white/70 p-2.5">
            <div className="mb-1 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-app-text">{place.name}</p>
                <p className="truncate text-[11px] text-app-muted">{place.address}</p>
              </div>
              <span className="shrink-0 rounded-full bg-app-bg px-2 py-0.5 text-[10px] font-semibold text-app-muted">{place.distance}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] text-app-muted">ETA {place.eta}</p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-app-muted/25 text-app-muted transition hover:border-violet-400 hover:text-violet-700"
                  aria-label={`Get directions to ${place.name}`}
                >
                  <DirectionIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-700 text-white shadow-sm transition hover:brightness-105"
                  aria-label={`Call ${place.name}`}
                >
                  <PhoneIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
