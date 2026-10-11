"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { getStoredConsent } from "@/lib/consent";

/** Only loads Vercel Analytics once the visitor has opted in via the consent banner. */
export function AnalyticsGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS !== "true") return;
    setEnabled(getStoredConsent() === "accepted");

    function onChange(e: Event) {
      setEnabled((e as CustomEvent).detail === "accepted");
    }
    window.addEventListener("gpf-consent-change", onChange);
    return () => window.removeEventListener("gpf-consent-change", onChange);
  }, []);

  if (!enabled) return null;
  return <Analytics />;
}
