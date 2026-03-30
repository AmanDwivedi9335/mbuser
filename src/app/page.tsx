export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <section className="w-full rounded-2xl bg-white p-6 shadow-lg shadow-fuchsia-200/30 sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-app-text sm:text-4xl">Medibank</h1>
        <p className="mt-4 max-w-2xl text-base text-app-muted">
          Production-grade family health vault setup is complete for Phase 1.
          Next we will implement secure authentication and onboarding flows.
        </p>
        <button type="button" className="btn-brand mt-8 rounded-xl px-5 py-2 text-sm font-semibold">
          SaaS Foundation Ready
        </button>
      </section>
    </main>
  );
}
