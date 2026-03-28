import { ReminderStatus, ReminderType } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { sendEmailReminder } from "@/lib/notifications/email";
import { sendPushReminder } from "@/lib/notifications/fcm";
import { enqueueReminder } from "@/features/medications/services/medications.server";

function combineDateAndTime(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const merged = new Date(date);
  merged.setHours(hours, minutes, 0, 0);
  return merged;
}

function inDateRange(target: Date, startDate: Date, endDate?: Date | null) {
  const normalizedStart = new Date(startDate);
  normalizedStart.setHours(0, 0, 0, 0);

  if (target < normalizedStart) return false;

  if (endDate) {
    const normalizedEnd = new Date(endDate);
    normalizedEnd.setHours(23, 59, 59, 999);
    if (target > normalizedEnd) return false;
  }

  return true;
}

export async function generateUpcomingReminders(hoursAhead = 24) {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

  const medications = await prisma.medication.findMany({
    where: {
      isActive: true,
    },
    include: {
      schedules: true,
    },
    take: 300,
  });

  let generated = 0;

  for (const medication of medications) {
    for (const schedule of medication.schedules) {
      for (let dayOffset = 0; dayOffset <= 2; dayOffset += 1) {
        const baseDate = new Date(now);
        baseDate.setDate(baseDate.getDate() + dayOffset);

        if (typeof schedule.dayOfWeek === "number" && schedule.dayOfWeek !== baseDate.getDay()) {
          continue;
        }

        const scheduledTime = combineDateAndTime(baseDate, schedule.time);

        if (schedule.intervalHours) {
          const intervalMs = schedule.intervalHours * 60 * 60 * 1000;
          for (let cursor = new Date(scheduledTime); cursor <= windowEnd; cursor = new Date(cursor.getTime() + intervalMs)) {
            if (cursor >= now && inDateRange(cursor, medication.startDate, medication.endDate)) {
              await enqueueReminder({
                profileId: medication.profileId,
                medicationId: medication.id,
                scheduledTime: cursor,
              });
              generated += 1;
            }
          }
          continue;
        }

        if (scheduledTime >= now && scheduledTime <= windowEnd && inDateRange(scheduledTime, medication.startDate, medication.endDate)) {
          await enqueueReminder({
            profileId: medication.profileId,
            medicationId: medication.id,
            scheduledTime,
          });
          generated += 1;
        }
      }
    }
  }

  return { generated };
}

export async function runReminderDispatch(limit = 100) {
  const pending = await prisma.reminderQueue.findMany({
    where: {
      status: ReminderStatus.PENDING,
      scheduledTime: {
        lte: new Date(),
      },
    },
    include: {
      medication: true,
      appointment: true,
      profile: {
        include: {
          household: {
            include: {
              members: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { scheduledTime: "asc" },
    take: limit,
  });

  let sent = 0;
  let failed = 0;

  for (const queueItem of pending) {
    const recipientEmail = queueItem.profile.household.members[0]?.user.email;
    const recipientPushToken = null;

    const title =
      queueItem.title ??
      (queueItem.reminderType === ReminderType.MEDICATION ? "Medication reminder" : "Appointment reminder");

    const body =
      queueItem.body ??
      (queueItem.reminderType === ReminderType.MEDICATION && queueItem.medication
        ? `Time to take ${queueItem.medication.name} (${queueItem.medication.dosage}${queueItem.medication.unit})`
        : queueItem.appointment
          ? `Upcoming appointment: ${queueItem.appointment.title}`
          : "You have an upcoming reminder.");

    const pushResult = await sendPushReminder({ token: recipientPushToken, title, body });

    const emailResult = !pushResult.sent && recipientEmail
      ? await sendEmailReminder({ to: recipientEmail, subject: title, body })
      : { sent: false };

    const wasSent = pushResult.sent || emailResult.sent;

    await prisma.reminderQueue.update({
      where: { id: queueItem.id },
      data: {
        status: wasSent ? ReminderStatus.SENT : ReminderStatus.FAILED,
      },
    });

    if (wasSent) {
      sent += 1;
    } else {
      failed += 1;
    }
  }

  return { processed: pending.length, sent, failed };
}
