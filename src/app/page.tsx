export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-16">
      <section className="w-full rounded-2xl bg-white p-10 shadow-lg shadow-fuchsia-200/30">
        <h1 className="text-4xl font-bold tracking-tight text-app-text">Medivault</h1>
        <p className="mt-4 max-w-2xl text-base text-app-muted">
          Production-grade family health vault setup is complete for Phase 1.
          Next we will implement secure authentication and onboarding flows.
        </p>
        <div className="mt-8 inline-flex rounded-xl bg-gradient-to-b from-[#d81b60] via-[#7b1fa2] to-[#3b0aa3] p-[1px]">
          <span className="rounded-[11px] bg-white px-5 py-2 text-sm font-semibold text-app-text">
            SaaS Foundation Ready
          </span>
        </div>
      </section>
    </main>
  );
}
