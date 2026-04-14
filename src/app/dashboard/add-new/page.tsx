import { FamilyTreeBuilder } from "@/features/dashboard/family-tree/components/family-tree-builder";

export default function AddNewPage() {
  return (
    <section className="min-h-[calc(100vh-7rem)] p-1 text-app-text sm:p-2">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Family workspace</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Family Tree Builder</h1>
          <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
            Build and manage relationships with premium controls, responsive interactions, and export-ready family maps.
          </p>
        </header>
        <FamilyTreeBuilder />
      </div>
    </section>
  );
}
