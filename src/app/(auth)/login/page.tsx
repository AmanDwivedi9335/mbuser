import Link from "next/link";

import { AuthForm } from "@/features/auth/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <AuthForm mode="login" />
        <p className="mt-4 text-center text-sm text-app-muted">
          Don&apos;t have an account? <Link className="font-semibold text-app-text" href="/signup">Sign up</Link>
        </p>
        <p className="mt-2 text-center text-sm text-app-muted">
          <Link className="font-semibold text-app-text" href="/forgot-password">Forgot password?</Link>
        </p>
      </div>
    </main>
  );
}
