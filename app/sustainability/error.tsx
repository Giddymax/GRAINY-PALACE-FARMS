"use client";

import { RouteError } from "@/components/ui/route-error";

export default function SustainabilityError({
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
      description="Something went wrong loading our sustainability policy. Please try again."
    />
  );
}
