"use client";

import { useEffect, useState } from "react";

import { fetchCurrentUser } from "@/features/dashboard/services/dashboard.client";
import type { CurrentUserResponse } from "@/features/dashboard/types/dashboard.types";

type UseCurrentUserState = {
  data: CurrentUserResponse | null;
  isLoading: boolean;
  error: string | null;
};

export function useCurrentUser() {
  const [state, setState] = useState<UseCurrentUserState>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    fetchCurrentUser()
      .then((data) => {
        if (!isMounted) return;

        setState({
          data,
          isLoading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (!isMounted) return;

        setState({
          data: null,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unable to load user",
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
