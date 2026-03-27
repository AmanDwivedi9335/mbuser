import { type Medication, MedicationLogStatus, type MedicationSchedule, ReminderStatus, type User } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

import type { AdherenceInsights, MedicationFrequencyType, MedicationItem, ScheduleInput } from "@/features/medications/types/medication.types";

type MedicationWithSchedules = Medication & { schedules: MedicationSchedule[] };

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

function resolveNextDoseAt(medication: MedicationWithSchedules) {
  const now = new Date();
  const schedules = medication.schedules;

  const candidates = schedules
    .map((schedule) => {
      const [hours, minutes] = schedule.time.split(":").map(Number);
      const next = new Date(now);
      next.setSeconds(0, 0);

      if (schedule.intervalHours) {
        const incrementMs = schedule.intervalHours * 60 * 60 * 1000;
        return new Date(Math.ceil(now.getTime() / incrementMs) * incrementMs);
      }

      if (typeof schedule.dayOfWeek === "number") {
        const delta = (schedule.dayOfWeek - now.getDay() + 7) % 7;
        next.setDate(now.getDate() + delta);
      }

      next.setHours(hours, minutes, 0, 0);

      if (next < now) {
        if (typeof schedule.dayOfWeek === "number") {
          next.setDate(next.getDate() + 7);
        } else {
          next.setDate(next.getDate() + 1);
        }
      }

      return next;
    })
    .sort((a, b) => a.getTime() - b.getTime());

  return candidates[0] ?? null;
}

function mapMedication(medication: MedicationWithSchedules): MedicationItem {
  return {
    id: medication.id,
    profileId: medication.profileId,
    name: medication.name,
    dosage: medication.dosage,
    unit: medication.unit,
    instructions: medication.instructions,
    startDate: medication.startDate.toISOString(),
    endDate: medication.endDate ? medication.endDate.toISOString() : null,
    frequencyType: medication.frequencyType as MedicationFrequencyType,
    isActive: medication.isActive,
    createdAt: medication.createdAt.toISOString(),
    schedules: medication.schedules.map((schedule) => ({
      time: schedule.time,
      dayOfWeek: schedule.dayOfWeek,
      intervalHours: schedule.intervalHours,
    })),
    nextDoseAt: resolveNextDoseAt(medication)?.toISOString() ?? null,
  };
}

export async function createMedicationForProfile(params: {
  user: User;
  input: {
    profileId: string;
    name: string;
    dosage: number;
    unit: string;
    instructions?: string;
    startDate: string;
    endDate?: string;
    frequencyType: MedicationFrequencyType;
    schedules: ScheduleInput[];
  };
}) {
  const profile = await getAuthorizedProfile(params.user.id, params.input.profileId);

  if (!profile) {
    throw new Error("Profile not found or unauthorized");
  }

  const medication = await prisma.medication.create({
    data: {
      profileId: profile.id,
      name: params.input.name,
      dosage: params.input.dosage,
      unit: params.input.unit,
      instructions: params.input.instructions || null,
      startDate: new Date(params.input.startDate),
      endDate: params.input.endDate ? new Date(params.input.endDate) : null,
      frequencyType: params.input.frequencyType,
      schedules: {
        create: params.input.schedules.map((schedule) => ({
          time: schedule.time,
          dayOfWeek: schedule.dayOfWeek ?? null,
          intervalHours: schedule.intervalHours ?? null,
        })),
      },
    },
    include: {
      schedules: {
        orderBy: { time: "asc" },
      },
    },
  });

  return mapMedication(medication);
}

export async function listMedicationsForProfile(params: {
  userId: string;
  profileId: string;
  status: "active" | "inactive" | "all";
  page: number;
  pageSize: number;
}) {
  const profile = await getAuthorizedProfile(params.userId, params.profileId);

  if (!profile) {
    throw new Error("Profile not found or unauthorized");
  }

  const where = {
    profileId: params.profileId,
    ...(params.status === "all" ? {} : { isActive: params.status === "active" }),
  };

  const [total, medications] = await Promise.all([
    prisma.medication.count({ where }),
    prisma.medication.findMany({
      where,
      include: {
        schedules: {
          orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }],
        },
      },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
  ]);

  return {
    medications: medications.map(mapMedication),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
    },
  };
}

export async function getMedicationById(params: { userId: string; medicationId: string }) {
  const medication = await prisma.medication.findFirst({
    where: {
      id: params.medicationId,
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
    include: {
      schedules: {
        orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }],
      },
    },
  });

  if (!medication) {
    throw new Error("Medication not found");
  }

  return mapMedication(medication);
}

export async function updateMedicationStatus(params: { userId: string; medicationId: string; isActive: boolean }) {
  const medication = await prisma.medication.findFirst({
    where: {
      id: params.medicationId,
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
  });

  if (!medication) {
    throw new Error("Medication not found");
  }

  await prisma.medication.update({
    where: { id: params.medicationId },
    data: { isActive: params.isActive },
  });
}

export async function createMedicationLog(params: {
  userId: string;
  profileId: string;
  medicationId: string;
  status: "TAKEN" | "SKIPPED";
  scheduledAt?: string;
}) {
  const medication = await prisma.medication.findFirst({
    where: {
      id: params.medicationId,
      profileId: params.profileId,
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
  });

  if (!medication) {
    throw new Error("Medication not found or unauthorized");
  }

  return prisma.medicationLog.create({
    data: {
      medicationId: medication.id,
      profileId: medication.profileId,
      scheduledAt: params.scheduledAt ? new Date(params.scheduledAt) : new Date(),
      takenAt: params.status === "TAKEN" ? new Date() : null,
      status: params.status,
    },
  });
}

export async function listMedicationLogs(params: {
  userId: string;
  profileId: string;
  medicationId?: string;
  fromDate?: string;
  toDate?: string;
  page: number;
  pageSize: number;
}) {
  const profile = await getAuthorizedProfile(params.userId, params.profileId);

  if (!profile) {
    throw new Error("Profile not found or unauthorized");
  }

  return prisma.medicationLog.findMany({
    where: {
      profileId: params.profileId,
      medicationId: params.medicationId,
      scheduledAt:
        params.fromDate || params.toDate
          ? {
              gte: params.fromDate ? new Date(params.fromDate) : undefined,
              lte: params.toDate ? new Date(params.toDate) : undefined,
            }
          : undefined,
    },
    orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
    skip: (params.page - 1) * params.pageSize,
    take: params.pageSize,
  });
}

export async function getAdherenceInsights(params: { userId: string; profileId: string; days?: number }): Promise<AdherenceInsights> {
  const periodDays = params.days ?? 7;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (periodDays - 1));

  const logs = await listMedicationLogs({
    userId: params.userId,
    profileId: params.profileId,
    fromDate: start.toISOString().slice(0, 10),
    page: 1,
    pageSize: 1000,
  });

  const totalScheduled = logs.length;
  const takenCount = logs.filter((log) => log.status === MedicationLogStatus.TAKEN).length;
  const missedCount = logs.filter((log) => log.status === MedicationLogStatus.MISSED).length;
  const skippedCount = logs.filter((log) => log.status === MedicationLogStatus.SKIPPED).length;

  const adherencePercent = totalScheduled === 0 ? 100 : Math.round((takenCount / totalScheduled) * 100);

  const sorted = [...logs].sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
  let currentStreak = 0;

  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    if (sorted[i]?.status === MedicationLogStatus.TAKEN) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  const message =
    missedCount > 0
      ? `You missed ${missedCount} dose${missedCount === 1 ? "" : "s"} in the last ${periodDays} days.`
      : `Great consistency. ${adherencePercent}% adherence over the last ${periodDays} days.`;

  return {
    totalScheduled,
    takenCount,
    missedCount,
    skippedCount,
    adherencePercent,
    currentStreak,
    message,
  };
}

export async function enqueueReminder(params: { profileId: string; medicationId: string; scheduledTime: Date }) {
  return prisma.reminderQueue.upsert({
    where: {
      medicationId_scheduledTime: {
        medicationId: params.medicationId,
        scheduledTime: params.scheduledTime,
      },
    },
    update: {},
    create: {
      profileId: params.profileId,
      medicationId: params.medicationId,
      scheduledTime: params.scheduledTime,
      status: ReminderStatus.PENDING,
    },
  });
}
