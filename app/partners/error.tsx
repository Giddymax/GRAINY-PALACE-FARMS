"use client";

import { RouteError } from "@/components/ui/route-error";

export default function PartnersError({
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
      title="Couldn't load partners"
      description="Something went wrong loading this page. Please try again."
    />
  );
}
