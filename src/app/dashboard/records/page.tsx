"use client";

import { UploadForm } from "@/features/records/components/upload-form";
import { RecordFilters } from "@/features/records/components/record-filters";
import { RecordList } from "@/features/records/components/record-list";
import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";
import { useRecords } from "@/features/records/hooks/use-records";

export default function RecordsPage() {
  const { selectedProfile } = useCurrentProfile();
  const { records, isLoading, error, refresh, search } = useRecords(selectedProfile?.id ?? null);

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Health Records Vault</h1>
        <p className="text-app-muted">Securely upload, organize, and search your family&apos;s medical records.</p>
      </header>

      {selectedProfile ? <UploadForm profileId={selectedProfile.id} onUploaded={() => void refresh()} /> : null}

      <div className="space-y-3">
        <RecordFilters onSearch={search} disabled={!selectedProfile || isLoading} />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <RecordList records={records} isLoading={isLoading} />
      </div>
    </section>
  );
}
