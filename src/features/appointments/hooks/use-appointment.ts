"use client";

import { useCallback, useEffect, useState } from "react";

import { getAppointment } from "@/features/appointments/services/appointments.client";
import type { AppointmentItem } from "@/features/appointments/types/appointment.types";

export function useAppointment(appointmentId: string) {
  const [appointment, setAppointment] = useState<(AppointmentItem & { followUps: AppointmentItem[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAppointment(appointmentId);
      setAppointment(response.appointment);
      setError(null);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load appointment");
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    appointment,
    isLoading,
    error,
    refresh,
  };
}
