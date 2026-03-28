"use client";

import { useCallback, useEffect, useState } from "react";

import { listAppointments } from "@/features/appointments/services/appointments.client";
import type { AppointmentItem, AppointmentStatus } from "@/features/appointments/types/appointment.types";

export function useAppointments(profileId: string | null, status?: AppointmentStatus) {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!profileId) {
      setAppointments([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await listAppointments({ profileId, status, page: 1, pageSize: 50 });
      setAppointments(response.appointments);
      setError(null);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load appointments");
    } finally {
      setIsLoading(false);
    }
  }, [profileId, status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    appointments,
    isLoading,
    error,
    refresh,
  };
}
