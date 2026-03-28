export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-16">
      <section className="w-full rounded-2xl bg-white p-10 shadow-lg shadow-fuchsia-200/30">
        <h1 className="text-4xl font-bold tracking-tight text-app-text">Medivault</h1>
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
