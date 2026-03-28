"use client";

import { zodResolver } from "@/features/auth/schemas/zod-resolver";
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "@/features/auth/schemas/auth";
import { useAuthSubmit } from "@/features/auth/hooks/use-auth-submit";
import { loginAsGuest, loginWithEmail, loginWithGoogle, signupWithEmail } from "@/features/auth/services/client-auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type Mode = "login" | "signup";

type AuthFormProps = {
  mode: Mode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === "signup";
  const router = useRouter();

  const { isLoading, error, run } = useAuthSubmit(async (email: string, password: string) => {
    if (isSignup) {
      await signupWithEmail(email, password);
    } else {
      await loginWithEmail(email, password);
    }

    router.push("/dashboard");
    router.refresh();
  });

  const { isLoading: googleLoading, run: runGoogle, error: googleError } = useAuthSubmit(async () => {
    await loginWithGoogle();
    router.push("/dashboard");
    router.refresh();
  });

  const { isLoading: guestLoading, run: runGuest, error: guestError } = useAuthSubmit(async () => {
    await loginAsGuest();
    router.push("/dashboard");
    router.refresh();
  });

  const form = useForm<SignupInput | LoginInput>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await run(values.email, values.password);
  });

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-bold text-app-text">{isSignup ? "Create your account" : "Welcome back"}</h1>
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
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-app-text">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            {...form.register("password")}
          />
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.password?.message}</p>
        </div>

        {(error || googleError || guestError) && <p className="text-sm text-red-600">{error ?? googleError ?? guestError}</p>}

        <button
          disabled={isLoading || googleLoading || guestLoading}
          type="submit"
          className="w-full rounded-lg bg-app-text px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {isSignup ? "Sign up" : "Log in"}
        </button>
      </form>

      <button
        disabled={isLoading || googleLoading || guestLoading}
        type="button"
        className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 font-semibold"
        onClick={() => void runGoogle()}
      >
        Continue with Google
      </button>

      {!isSignup && (
        <button
          disabled={isLoading || googleLoading || guestLoading}
          type="button"
          className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 font-semibold"
          onClick={() => void runGuest()}
        >
          Continue as Guest
        </button>
      )}
    </div>
  );
}
