"use client";

import { RouteError } from "@/components/ui/route-error";

export default function TraceabilityError({
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
      title="Couldn't load traceability lookup"
      description="Something went wrong loading this page. Please try again."
    />
  );
}
