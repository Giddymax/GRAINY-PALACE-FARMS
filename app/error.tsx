"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <AlertTriangle className="size-14 text-destructive" />
      <h1 className="font-heading text-3xl font-semibold">
        Something went wrong
      </h1>
      <p className="text-muted-foreground">
        Please try again. If the problem continues, contact us on WhatsApp and
        we&apos;ll help right away.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
