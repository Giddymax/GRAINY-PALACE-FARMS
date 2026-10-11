"use client";

import { RouteError } from "@/components/ui/route-error";

export default function CartError({
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
      title="Couldn't load your cart"
      description="Something went wrong loading your cart. Please try again."
    />
  );
}
