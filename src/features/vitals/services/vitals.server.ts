import { type Vital, type VitalType, VitalSource } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { normalizeVitalInput } from "@/lib/utils/validations/vitals";
import { parseVitalsCsv } from "@/lib/utils/validations/csv";

async function getAuthorizedProfile(userId: string, profileId: string) {
  return prisma.profile.findFirst({
    where: {
      id: profileId,
      household: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
    select: { id: true },
  });
}

function mapVital(vital: Vital) {
  return {
    id: vital.id,
    profileId: vital.profileId,
    type: vital.type,
    value1: vital.value1,
    value2: vital.value2,
    unit: vital.unit,
    source: vital.source,
    recordedAt: vital.recordedAt.toISOString(),
    createdAt: vital.createdAt.toISOString(),
  };
}

export async function createVitalForProfile(params: {
  userId: string;
  input: {
    profileId: string;
    type: VitalType;
    value1: number;
    value2?: number;
    unit: string;
    source?: VitalSource;
    recordedAt: string;
  };
}) {
  const profile = await getAuthorizedProfile(params.userId, params.input.profileId);

  if (!profile) {
    throw new Error("Profile not found or unauthorized");
  }

  const normalized = normalizeVitalInput({
    type: params.input.type,
    value1: params.input.value1,
    value2: params.input.value2,
    unit: params.input.unit,
    recordedAt: params.input.recordedAt,
  });

  const vital = await prisma.vital.create({
    data: {
      profileId: profile.id,
      type: params.input.type,
      value1: normalized.value1,
      value2: normalized.value2 ?? null,
      unit: normalized.unit,
      source: params.input.source ?? VitalSource.MANUAL,
      recordedAt: new Date(normalized.recordedAt),
    },
  });

  return mapVital(vital);
}

export async function listVitalsForProfile(params: {
  userId: string;
  profileId: string;
  type?: VitalType;
  fromDate?: string;
  toDate?: string;
  page: number;
  pageSize: number;
  sort: "asc" | "desc";
}) {
  const profile = await getAuthorizedProfile(params.userId, params.profileId);

  if (!profile) {
    throw new Error("Profile not found or unauthorized");
  }

  const where = {
    profileId: params.profileId,
    type: params.type,
    recordedAt: params.fromDate || params.toDate
      ? {
          gte: params.fromDate ? new Date(params.fromDate) : undefined,
          lte: params.toDate ? new Date(params.toDate) : undefined,
        }
      : undefined,
  };

  const [total, vitals] = await Promise.all([
    prisma.vital.count({ where }),
    prisma.vital.findMany({
      where,
      orderBy: [{ recordedAt: params.sort }, { createdAt: "desc" }],
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
  ]);

  return {
    vitals: vitals.map(mapVital),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
    },
  };
}

export async function deleteVitalById(params: { userId: string; vitalId: string }) {
  const vital = await prisma.vital.findFirst({
    where: {
      id: params.vitalId,
      profile: {
        household: {
          members: {
            some: {
              userId: params.userId,
            },
          },
        },
      },
    },
    select: { id: true },
  });

  if (!vital) {
    throw new Error("Vital not found");
  }

  await prisma.vital.delete({ where: { id: vital.id } });
}

export async function importVitalsForProfile(params: {
  userId: string;
  input: {
    profileId: string;
    type: VitalType;
    unit: string;
    source?: VitalSource;
    csv: string;
  };
}) {
  const profile = await getAuthorizedProfile(params.userId, params.input.profileId);

  if (!profile) {
    throw new Error("Profile not found or unauthorized");
  }

  const parsed = parseVitalsCsv({ csv: params.input.csv, type: params.input.type });

  if (!parsed.rows.length) {
    return {
      inserted: 0,
      skipped: parsed.invalidRows,
    };
  }

  const data = parsed.rows.map((row) => {
    const normalized = normalizeVitalInput({
      type: params.input.type,
      unit: params.input.unit,
      value1: row.value1,
      value2: row.value2,
      recordedAt: row.recordedAt,
    });

    return {
      profileId: profile.id,
      type: params.input.type,
      unit: normalized.unit,
      value1: normalized.value1,
      value2: normalized.value2 ?? null,
      recordedAt: new Date(normalized.recordedAt),
      source: params.input.source ?? VitalSource.CSV,
    };
  });

  await prisma.vital.createMany({ data });

  return {
    inserted: data.length,
    skipped: parsed.invalidRows,
  };
}
