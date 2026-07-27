import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Create an account" };

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold">Create an account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Optional — you can also check out as a guest. An account just makes
        reordering and tracking past orders faster.
      </p>
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <SignupForm />
      </div>
    </div>
  );
}
