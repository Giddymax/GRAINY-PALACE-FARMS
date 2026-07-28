"use client";

import { RouteError } from "@/components/ui/route-error";

export default function CheckoutError({
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
      title="Couldn't load checkout"
      description="Something went wrong loading checkout. Please try again."
    />
  );
}
