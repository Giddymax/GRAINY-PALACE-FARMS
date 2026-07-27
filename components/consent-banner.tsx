"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CONSENT_KEY = "gpf.analytics-consent";
export type ConsentValue = "accepted" | "rejected";

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function ConsentBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!getStoredConsent()) setVisible(true);
  }, []);

  function choose(value: ConsentValue) {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new CustomEvent("gpf:consent-changed", { detail: value }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:rounded-xl sm:border"
    >
      <p className="text-sm">
        We use privacy-friendly analytics to understand how the site is
        used — nothing is tracked until you say yes. Read our{" "}
        <Link href="/privacy" className="underline">
          data practices
        </Link>{" "}
        or choose below.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => choose("accepted")}>
          Accept analytics
        </Button>
        <Button size="sm" variant="outline" onClick={() => choose("rejected")}>
          No thanks
        </Button>
      </div>
    </div>
  );
}
