"use client";

import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/auth/schemas/auth";
import { zodResolver } from "@/features/auth/schemas/zod-resolver";
import { sendPasswordReset } from "@/features/auth/services/client-auth";
import { useForm } from "react-hook-form";
import { useState } from "react";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setMessage(null);
    await sendPasswordReset(values.email);
    setMessage("Password reset email sent.");
  });

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-bold text-app-text">Reset your password</h1>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-app-text">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            {...form.register("email")}
          />
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.email?.message}</p>
        </div>
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button type="submit" className="btn-brand w-full rounded-lg px-4 py-2 font-semibold">
          Send reset link
        </button>
      </form>
    </div>
  );
}
