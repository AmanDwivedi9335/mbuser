import { AppointmentStatus, ReminderStatus, ReminderType } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

import type { AppointmentItem } from "@/features/appointments/types/appointment.types";

type MappedAppointment = Awaited<ReturnType<typeof getAppointmentById>>;

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

function mapAppointment(appointment: {
  id: string;
  profileId: string;
  parentAppointmentId: string | null;
  title: string;
  doctorName: string;
  clinicName: string;
  specialty: string;
  appointmentAt: Date;
  status: AppointmentStatus;
  notes: string | null;
  followUpAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  appointmentNotes: { id: string; content: string; createdAt: Date }[];
}): AppointmentItem {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return {
    id: appointment.id,
    profileId: appointment.profileId,
    parentAppointmentId: appointment.parentAppointmentId,
    title: appointment.title,
    doctorName: appointment.doctorName,
    clinicName: appointment.clinicName,
    specialty: appointment.specialty,
    appointmentAt: appointment.appointmentAt.toISOString(),
    status: appointment.status,
    notes: appointment.notes,
    followUpAt: appointment.followUpAt?.toISOString() ?? null,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
    appointmentNotes: appointment.appointmentNotes.map((note) => ({
      id: note.id,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
    })),
    overdueFollowUp: Boolean(appointment.followUpAt && appointment.followUpAt < today && appointment.status !== AppointmentStatus.COMPLETED),
    isToday: appointment.appointmentAt >= today && appointment.appointmentAt < tomorrow,
  };
}

async function createAppointmentReminder(params: {
  profileId: string;
  appointmentId: string;
  scheduledTime: Date;
  reminderType: ReminderType;
  title: string;
  body: string;
}) {
  return prisma.reminderQueue.create({
    data: {
      profileId: params.profileId,
      appointmentId: params.appointmentId,
      scheduledTime: params.scheduledTime,
      reminderType: params.reminderType,
      status: ReminderStatus.PENDING,
      title: params.title,
      body: params.body,
    },
  });
}

export async function createAppointmentForProfile(params: {
  userId: string;
  input: {
    profileId: string;
    title: string;
    doctorName: string;
    clinicName: string;
    specialty: string;
    appointmentAt: string;
    followUpAt?: string;
    parentAppointmentId?: string;
  };
}) {
  const profile = await getAuthorizedProfile(params.userId, params.input.profileId);

  if (!profile) {
    throw new Error("Profile not found or unauthorized");
  }

  const appointment = await prisma.appointment.create({
    data: {
      profileId: profile.id,
      parentAppointmentId: params.input.parentAppointmentId ?? null,
      title: params.input.title,
      doctorName: params.input.doctorName,
      clinicName: params.input.clinicName,
      specialty: params.input.specialty,
      appointmentAt: new Date(params.input.appointmentAt),
      followUpAt: params.input.followUpAt ? new Date(params.input.followUpAt) : null,
      status: AppointmentStatus.UPCOMING,
    },
    include: {
      appointmentNotes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const appointmentDate = new Date(params.input.appointmentAt);

  await createAppointmentReminder({
    profileId: appointment.profileId,
    appointmentId: appointment.id,
    scheduledTime: appointmentDate,
    reminderType: ReminderType.APPOINTMENT,
    title: "Appointment reminder",
    body: `Appointment with Dr. ${appointment.doctorName} at ${appointmentDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
  });

  if (params.input.followUpAt) {
    const followUpDate = new Date(params.input.followUpAt);
    await createAppointmentReminder({
      profileId: appointment.profileId,
      appointmentId: appointment.id,
      scheduledTime: followUpDate,
      reminderType: ReminderType.FOLLOW_UP,
      title: "Follow-up reminder",
      body: `Follow-up needed for ${appointment.title} on ${followUpDate.toLocaleDateString()}`,
    });
  }

  return mapAppointment(appointment);
}

export async function listAppointmentsForProfile(params: {
  userId: string;
  profileId: string;
  status?: AppointmentStatus;
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
    status: params.status,
    appointmentAt:
      params.fromDate || params.toDate
        ? {
            gte: params.fromDate ? new Date(params.fromDate) : undefined,
            lte: params.toDate ? new Date(params.toDate) : undefined,
          }
        : undefined,
  };

  const [total, appointments] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.findMany({
      where,
      include: {
        appointmentNotes: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: [{ appointmentAt: params.sort }, { createdAt: "desc" }],
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
  ]);

  return {
    appointments: appointments.map(mapAppointment),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
    },
  };
}

export async function getAppointmentById(params: { userId: string; appointmentId: string }) {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: params.appointmentId,
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
      appointmentNotes: {
        orderBy: { createdAt: "desc" },
      },
      followUps: {
        include: {
          appointmentNotes: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { appointmentAt: "asc" },
      },
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return {
    ...mapAppointment(appointment),
    followUps: appointment.followUps.map(mapAppointment),
  };
}

const VALID_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  UPCOMING: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
  COMPLETED: [AppointmentStatus.UPCOMING],
  CANCELLED: [AppointmentStatus.UPCOMING],
};

export async function updateAppointmentStatus(params: { userId: string; appointmentId: string; status: AppointmentStatus }) {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: params.appointmentId,
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

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const allowed = VALID_TRANSITIONS[appointment.status];

  if (!allowed.includes(params.status)) {
    throw new Error(`Invalid status transition from ${appointment.status} to ${params.status}`);
  }

  await prisma.appointment.update({
    where: { id: params.appointmentId },
    data: { status: params.status },
  });
}

export async function addAppointmentNote(params: { userId: string; appointmentId: string; content: string }) {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: params.appointmentId,
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

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  await prisma.appointmentNote.create({
    data: {
      appointmentId: appointment.id,
      content: params.content,
    },
  });
}

export async function createFollowUp(params: {
  userId: string;
  appointmentId: string;
  followUpAt: string;
  mode: "appointment" | "reminder";
  title?: string;
}) {
  const source = await prisma.appointment.findFirst({
    where: {
      id: params.appointmentId,
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

  if (!source) {
    throw new Error("Appointment not found");
  }

  const followUpDate = new Date(params.followUpAt);

  await prisma.appointment.update({
    where: { id: source.id },
    data: { followUpAt: followUpDate },
  });

  if (params.mode === "reminder") {
    await createAppointmentReminder({
      profileId: source.profileId,
      appointmentId: source.id,
      scheduledTime: followUpDate,
      reminderType: ReminderType.FOLLOW_UP,
      title: "Follow-up reminder",
      body: `Follow-up for ${source.title} due on ${followUpDate.toLocaleDateString()}`,
    });

    return { type: "reminder" as const };
  }

  const created = await createAppointmentForProfile({
    userId: params.userId,
    input: {
      profileId: source.profileId,
      title: params.title ?? `Follow-up: ${source.title}`,
      doctorName: source.doctorName,
      clinicName: source.clinicName,
      specialty: source.specialty,
      appointmentAt: followUpDate.toISOString(),
      parentAppointmentId: source.id,
    },
  });

  return { type: "appointment" as const, appointment: created };
}

export type AppointmentDetail = NonNullable<MappedAppointment>;
