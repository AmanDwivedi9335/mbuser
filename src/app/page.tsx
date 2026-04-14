import Link from "next/link";

const highlights = [
  {
    title: "Unified family timeline",
    description:
      "Appointments, medications, records, and vitals stay synced in one intelligent view.",
  },
  {
    title: "Private by design",
    description:
      "End-to-end encrypted workflows with profile-level controls keep sensitive data protected.",
  },
  {
    title: "Care team ready",
    description:
      "Share updates with doctors and caregivers through clean, role-aware collaboration.",
  },
];

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-4 py-8 sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute inset-x-0 top-[-180px] h-[460px] bg-[radial-gradient(circle_at_top,rgba(106,132,255,0.3),transparent_60%)]" />
      <div className="pointer-events-none absolute bottom-[-220px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(85,167,255,0.18),transparent_72%)]" />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-[32px] border border-white/65 bg-white/75 p-6 shadow-[0_30px_80px_-45px_rgba(38,56,90,0.55)] backdrop-blur-xl sm:p-10 lg:p-12">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 pb-5">
          <p className="text-lg font-semibold tracking-tight text-slate-900">Medibank</p>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Log in
            </Link>
            <Link href="/signup" className="btn-brand rounded-full px-5 py-2 text-sm font-semibold">
              Create account
            </Link>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.95fr] lg:items-end">
          <div>
            <span className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Care intelligence platform
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              A sleek health workspace that feels as effortless as your favorite Apple apps.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Designed for modern families and care teams, Medibank combines polished UX with enterprise-grade health data workflows so every task is fast, clear, and confidently secure.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn-brand rounded-full px-6 py-3 text-sm font-semibold">
                Open dashboard
              </Link>
              <Link
                href="/onboarding"
                className="rounded-full border border-slate-300/90 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                Start onboarding
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.7)]">
            <p className="text-sm font-medium text-slate-500">Today in your command center</p>
            <ul className="mt-5 space-y-4">
              <li className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Medication adherence</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">98%</p>
                <p className="mt-1 text-sm text-slate-600">On-schedule doses across active profiles.</p>
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Upcoming appointments</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">4 this week</p>
                <p className="mt-1 text-sm text-slate-600">Auto reminders already queued and delivered.</p>
              </li>
            </ul>
          </aside>
        </div>

        <div className="grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
