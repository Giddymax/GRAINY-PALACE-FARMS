"use client";

import { RouteError } from "@/components/ui/route-error";

export default function CategoryError({
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
      title="Couldn't load this category"
      description="Something went wrong loading these products. Please try again."
    />
  );
}
