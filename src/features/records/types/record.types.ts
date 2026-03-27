export type RecordCategory =
  | "LAB_RESULT"
  | "PRESCRIPTION"
  | "VACCINATION"
  | "IMAGING"
  | "DISCHARGE_SUMMARY"
  | "BILLING"
  | "INSURANCE"
  | "OTHER";

export type VaultRecordFile = {
  id: string;
  mimeType: string;
  originalName: string;
  size: number;
  createdAt: string;
};

export type VaultRecord = {
  id: string;
  profileId: string;
  category: RecordCategory;
  title: string;
  providerName: string | null;
  recordDate: string | null;
  notes: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  files: VaultRecordFile[];
};

export type RecordListResponse = {
  records: VaultRecord[];
};

export type RecordSearchResponse = {
  records: VaultRecord[];
  query: string;
};

export type UploadRecordPayload = {
  profileId: string;
  category: RecordCategory;
  title: string;
  providerName?: string;
  recordDate?: string;
  notes?: string;
  tags?: string[];
};
