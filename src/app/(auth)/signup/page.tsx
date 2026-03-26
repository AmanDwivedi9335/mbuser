import Link from "next/link";

import { AuthForm } from "@/features/auth/components/auth-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <AuthForm mode="signup" />
        <p className="mt-4 text-center text-sm text-app-muted">
          Already have an account? <Link className="font-semibold text-app-text" href="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
