import { z } from "zod";

const isoDateSchema = z.string().datetime({ offset: true });

export const appointmentStatusSchema = z.enum(["UPCOMING", "COMPLETED", "CANCELLED"]);

export const createAppointmentSchema = z.object({
  profileId: z.string().min(1),
  title: z.string().min(2).max(120),
  doctorName: z.string().min(2).max(120),
  clinicName: z.string().min(2).max(120),
  specialty: z.string().min(2).max(120),
  appointmentAt: isoDateSchema,
  followUpAt: isoDateSchema.optional(),
}).superRefine((data, ctx) => {
  if (data.followUpAt && new Date(data.followUpAt) <= new Date(data.appointmentAt)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["followUpAt"],
      message: "Follow-up date must be after appointment date",
    });
  }
});

export const listAppointmentsQuerySchema = z.object({
  profileId: z.string().min(1),
  status: appointmentStatusSchema.optional(),
  fromDate: z.string().datetime({ offset: true }).optional(),
  toDate: z.string().datetime({ offset: true }).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.enum(["asc", "desc"]).default("asc"),
});

export const updateAppointmentStatusSchema = z.object({
  appointmentId: z.string().min(1),
  status: appointmentStatusSchema,
});

export const addAppointmentNoteSchema = z.object({
  appointmentId: z.string().min(1),
  content: z.string().min(1).max(5000),
});

export const createFollowUpSchema = z.object({
  appointmentId: z.string().min(1),
  mode: z.enum(["appointment", "reminder"]),
  followUpAt: isoDateSchema,
  title: z.string().min(2).max(120).optional(),
});
