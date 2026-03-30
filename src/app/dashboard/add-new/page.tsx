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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

export default function AddNewPage() {
  return (
    <section className="min-h-[calc(100vh-7.5rem)] px-0.5 pb-6 text-app-text sm:px-1">
      <div className="mx-auto w-full max-w-[1220px] space-y-7">
        <header className="flex items-start gap-3 sm:gap-4 lg:items-center">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-app-border bg-app-panel text-app-muted transition-colors hover:bg-app-surface sm:h-12 sm:w-12"
            aria-label="Go back to dashboard"
          >
            <BackIcon />
          </Link>

          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Family Health Hub</h1>
            <p className="mt-1 text-app-muted">Manage health records for your loved ones</p>
          </div>
        </header>

        <div className="grid items-stretch gap-6 xl:grid-cols-2">
          <article className="flex h-full min-h-[370px] flex-col rounded-4xl border border-app-muted/10 bg-app-surface px-4 py-5 shadow-[0_2px_8px_rgba(42,21,59,0.06)] sm:px-8 sm:py-6">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-app-text text-3xl font-semibold text-white shadow-[0_8px_18px_rgba(42,21,59,0.25)] sm:h-24 sm:w-24 sm:text-5xl">
                  A
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xl font-semibold leading-tight tracking-tight sm:text-3xl">Alex Johnson</p>
                  <p className="mt-2 text-base text-app-muted">Self • 34 years old</p>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-4 rounded-full border border-app-muted/20 bg-app-bg px-4 py-2 text-app-muted">
                <button type="button" className="rounded-full p-2 transition-colors hover:bg-app-surface hover:text-app-text" aria-label="Share profile">
                  <ShareIcon />
                </button>
                <button type="button" className="rounded-full p-2 transition-colors hover:bg-app-surface hover:text-app-text" aria-label="Edit profile">
                  <EditIcon />
                </button>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-10">
              <p className="inline-flex items-center gap-3 rounded-2xl border border-app-muted/20 bg-app-bg px-4 py-3 text-base text-app-muted">
                <FolderIcon />
                <span className="font-semibold text-app-text">0</span>
                documents
              </p>
              <Link
                href="/dashboard/records"
                className="inline-flex items-center gap-2 rounded-full border border-app-muted/20 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-app-text transition-colors hover:bg-app-bg"
              >
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
