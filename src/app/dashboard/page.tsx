export default function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-16">
      <h1 className="text-3xl font-bold text-app-text">Dashboard</h1>
      <p className="mt-2 text-app-muted">You are authenticated through Medivault session middleware.</p>
    </main>
  );
}
