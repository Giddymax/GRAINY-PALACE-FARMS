"use client";

import { RouteError } from "@/components/ui/route-error";

export default function FishError({
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
      title="Couldn't load fish & aquaculture"
      description="Something went wrong loading this page. Please try again."
    />
  );
}
