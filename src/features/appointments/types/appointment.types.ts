export type AppointmentStatus = "UPCOMING" | "COMPLETED" | "CANCELLED";

export type AppointmentNoteItem = {
  id: string;
  content: string;
  createdAt: string;
};

export type AppointmentItem = {
  id: string;
  profileId: string;
  parentAppointmentId: string | null;
  title: string;
  doctorName: string;
  clinicName: string;
  specialty: string;
  appointmentAt: string;
  status: AppointmentStatus;
  notes: string | null;
  followUpAt: string | null;
  createdAt: string;
  updatedAt: string;
  appointmentNotes: AppointmentNoteItem[];
  overdueFollowUp: boolean;
  isToday: boolean;
};

export type AppointmentListResponse = {
  appointments: AppointmentItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

export type CreateAppointmentPayload = {
  profileId: string;
  title: string;
  doctorName: string;
  clinicName: string;
  specialty: string;
  appointmentAt: string;
  followUpAt?: string;
};
