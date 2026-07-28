"use client";

import { RouteError } from "@/components/ui/route-error";

export default function LivestockError({
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
      title="Couldn't load livestock"
      description="Something went wrong loading this page. Please try again."
    />
  );
}
