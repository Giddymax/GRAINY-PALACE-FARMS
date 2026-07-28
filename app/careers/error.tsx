"use client";

import { RouteError } from "@/components/ui/route-error";

export default function CareersError({
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
      title="Couldn't load careers"
      description="Something went wrong loading open roles. Please try again."
    />
  );
}
