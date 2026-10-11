import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { WordMark } from "@/components/brand/logo-mark";

export const metadata: Metadata = { title: "Staff sign in" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="mb-6">
        <WordMark />
      </div>
      <h1 className="font-heading text-2xl font-semibold">Staff sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        For Grainy Palace Farms admin and staff accounts only.
      </p>
      {error === "unauthorized" && (
        <p role="alert" className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          That account doesn&apos;t have admin access, or has been deactivated.
        </p>
      )}
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <LoginForm next={next ?? "/admin"} signupHref="/" />
      </div>
    </div>
  );
}
