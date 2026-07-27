import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Track orders, reorder faster, or access your partner dashboard.
        Guests can still browse and check out without an account.
      </p>
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <LoginForm next={next} />
      </div>
    </div>
  );
}
