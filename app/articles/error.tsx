"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticlesError({
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
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <AlertTriangle className="size-10 text-destructive" />
      <h2 className="font-heading text-xl font-semibold">
        Couldn&apos;t load the Knowledge Hub
      </h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
