import Link from "next/link";

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
        <p className="mt-4 text-center text-sm text-app-muted">
          Back to <Link className="font-semibold text-app-text" href="/login">login</Link>
        </p>
      </div>
    </main>
  );
}
