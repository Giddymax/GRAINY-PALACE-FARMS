"use client";

import { RouteError } from "@/components/ui/route-error";

export default function AboutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      title="Couldn't load this page"
      description="Something went wrong loading our story. Please try again."
    />
  );
}
