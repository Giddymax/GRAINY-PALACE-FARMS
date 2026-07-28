"use client";

import { RouteError } from "@/components/ui/route-error";

export default function NewsError({
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
      title="Couldn't load news & events"
      description="Something went wrong loading news and events. Please try again."
    />
  );
}
