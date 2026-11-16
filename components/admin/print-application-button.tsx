"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintApplicationButton() {
  return (
    <Button type="button" onClick={() => window.print()} className="no-print gap-2">
      <Printer className="size-4" /> Print / save as PDF
    </Button>
  );
}
