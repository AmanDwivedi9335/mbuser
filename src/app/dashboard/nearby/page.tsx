"use client";

import { useMemo, useState } from "react";

import { DirectionIcon, PhoneIcon } from "@/components/ui/icons";

type NearbyCategory = "Doctors" | "Labs" | "Hospitals";

type NearbyPlace = {
  name: string;
  specialty: string;
  distance: string;
  eta: string;
  address: string;
  availability: string;
};

const TABS: NearbyCategory[] = ["Doctors", "Labs", "Hospitals"];

const NEARBY_DATA: Record<NearbyCategory, NearbyPlace[]> = {
  Doctors: [
    {
      name: "Dr. Olivia Carter",
      specialty: "General Physician",
      distance: "0.8 mi",
      eta: "6 min",
      address: "125 Maple Ave, Suite 220",
      availability: "Available in 20 min",
    },
    {
      name: "Dr. Ethan Moore",
      specialty: "Cardiologist",
      distance: "1.4 mi",
      eta: "10 min",
      address: "44 Harbor Road, Floor 3",
      availability: "Available Tomorrow",
    },
    {
      name: "Dr. Amelia Shaw",
      specialty: "Dermatologist",
      distance: "2.2 mi",
      eta: "13 min",
      address: "290 Cedar Street, Clinic B",
      availability: "Available Today",
    },
  ],
  Labs: [
    {
      name: "HealthFirst Diagnostics",
      specialty: "Blood & Pathology",
      distance: "0.9 mi",
      eta: "7 min",
      address: "31 Garden Plaza",
      availability: "Open until 9:00 PM",
    },
    {
      name: "CityCare Lab Center",
      specialty: "Radiology & Imaging",
      distance: "1.7 mi",
      eta: "11 min",
      address: "82 Lake Point Blvd",
      availability: "Open until 8:00 PM",
    },
    {
      name: "PrimePath Labs",
      specialty: "Routine Diagnostic Tests",
      distance: "2.3 mi",
      eta: "14 min",
      address: "210 Market Street",
      availability: "Open 24 Hours",
    },
  ],
  Hospitals: [
    {
      name: "Mercy General Hospital",
      specialty: "Emergency & Inpatient Care",
      distance: "1.2 mi",
      eta: "8 min",
      address: "12 Wellness Drive",
      availability: "Emergency Open 24/7",
    },
    {
      name: "Northside Medical Center",
      specialty: "Multispecialty Hospital",
      distance: "2.8 mi",
      eta: "16 min",
      address: "550 Sunrise Way",
      availability: "Open 24 Hours",
    },
    {
      name: "St. Helena Community",
      specialty: "General & Family Care",
      distance: "3.4 mi",
      eta: "19 min",
      address: "400 Ivy Circle",
      availability: "Open until 10:00 PM",
    },
  ],
};

export default function NearbyPage() {
  const [activeTab, setActiveTab] = useState<NearbyCategory>("Doctors");
  const places = useMemo(() => NEARBY_DATA[activeTab], [activeTab]);

  return (
    <section className="space-y-6">
      <header className="rounded-4xl border border-app-muted/10 bg-gradient-to-r from-fuchsia-600 via-violet-700 to-indigo-700 p-6 text-white shadow-[0_14px_40px_-18px_rgba(59,10,163,0.8)]">
        <p className="text-sm font-medium text-white/80">Near By</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Find Doctors, Labs & Hospitals Near You</h1>
        <p className="mt-2 text-sm text-white/85 sm:text-base">
          Explore nearby healthcare services and quickly take action with one-tap direction and call options.
        </p>
      </header>

      <div className="inline-flex rounded-2xl border border-app-muted/20 bg-app-surface p-1.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                isActive ? "bg-gradient-to-r from-fuchsia-600 to-violet-700 text-white shadow-sm" : "text-app-muted hover:text-app-text",
              ].join(" ")}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {places.map((place) => (
          <article key={place.name} className="rounded-3xl border border-app-muted/15 bg-app-surface p-5 shadow-[0_8px_20px_-14px_rgba(42,21,59,0.45)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-app-text">{place.name}</h2>
                <p className="text-sm text-app-muted">{place.specialty}</p>
              </div>
              <span className="rounded-full bg-app-bg px-3 py-1 text-xs font-semibold text-app-muted">{place.distance}</span>
            </div>

            <p className="mt-3 text-sm text-app-muted">{place.address}</p>
            <p className="mt-1 inline-flex rounded-full bg-violet-700/10 px-3 py-1 text-xs font-semibold text-violet-700">{place.availability}</p>

            <div className="mt-4 flex items-center justify-between border-t border-app-muted/15 pt-4">
              <p className="text-sm font-medium text-app-muted">ETA {place.eta}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-app-muted/25 bg-white px-3 py-2 text-sm font-semibold text-app-text transition hover:border-violet-400 hover:text-violet-700"
                  aria-label={`Get directions to ${place.name}`}
                >
                  <DirectionIcon className="h-4 w-4" aria-hidden="true" />
                  Direction
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
                  aria-label={`Call ${place.name}`}
                >
                  <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                  Call
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
