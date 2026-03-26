"use client";

import { useState } from "react";

export function useAuthSubmit<TArgs extends unknown[]>(callback: (...args: TArgs) => Promise<void>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (...args: TArgs) => {
    try {
      setError(null);
      setIsLoading(true);
      await callback(...args);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Authentication failed.");
      throw cause;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, run, setError };
}
