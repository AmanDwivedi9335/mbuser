import Link from "next/link";
import { AddFamilyMemberModal } from "@/features/dashboard/components/add-family-member-modal";

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7-4.6" />
      <path d="m8.2 13.2 7 4.6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M12 20h9" />
      <path d="m16.5 3.5 4 4L8 20l-5 1 1-5z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

export default function AddNewPage() {
  return (
    <section className="min-h-[calc(100vh-7.5rem)] space-y-5 text-app-text">
      <div className="mx-auto w-full max-w-[1040px] space-y-8">
        <header className="flex items-start gap-4">
          <Link
            href="/dashboard"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-app-border bg-app-panel text-app-muted transition-colors hover:bg-app-surface"
            aria-label="Go back to dashboard"
          >
            <BackIcon />
          </Link>

          <div>
            <h1 className="text-2xl font-bold leading-tight">Family Health Hub</h1>
            <p className="text-app-muted">Manage health records for your loved ones</p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-app-border bg-app-panel px-7 py-6 shadow-[0_10px_20px_rgba(58,82,110,0.12)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="flex h-30 w-30 items-center justify-center rounded-full bg-[#397cf2] text-6xl font-semibold text-white shadow-[0_8px_14px_rgba(57,124,242,0.28)]">
                  A
                </div>
                <div>
                  <p className="text-2xl font-semibold leading-tight">Alex Johnson</p>
                  <p className="mt-2 text-app-muted">Self • 34 years old</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-full border border-app-border bg-app-surface px-4 py-2 text-app-muted">
                <button type="button" className="rounded-full p-2 hover:bg-app-panel" aria-label="Share profile">
                  <ShareIcon />
                </button>
                <button type="button" className="rounded-full p-2 hover:bg-app-panel" aria-label="Edit profile">
                  <EditIcon />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="inline-flex items-center gap-3 rounded-2xl bg-app-surface px-4 py-3 text-base text-app-muted">
                <FolderIcon />
                <span className="font-semibold text-app-text">0</span>
                documents
              </p>
              <Link href="/dashboard/records" className="inline-flex items-center gap-2 text-base font-semibold text-app-accent hover:underline">
                <DocumentIcon />
                View Documents
              </Link>
            </div>
          </article>

          <AddFamilyMemberModal />
        </div>
      </div>
    </section>
  );
}
