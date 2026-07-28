"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStoredConsent, storeConsent } from "@/lib/consent";

/**
 * Privacy-first default: analytics stay off until the visitor explicitly
 * opts in. "Necessary only" (the safer default action) never enables
 * tracking — only "Accept" does.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  function choose(choice: "accepted" | "necessary-only") {
    storeConsent(choice);
    setVisible(false);
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-lg sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5"
    >
      <p className="text-sm text-muted-foreground">
        We use privacy-friendly, cookie-less analytics to understand how the site is used. No
        personal data is sold or shared. Read our{" "}
        <Link href="/about" className="underline">
          privacy approach
        </Link>
        .
      </p>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <Button size="sm" variant="outline" onClick={() => choose("necessary-only")}>
          Necessary only
        </Button>
        <Button size="sm" onClick={() => choose("accepted")}>
          Accept
        </Button>
      </div>
    </div>
  );
}
