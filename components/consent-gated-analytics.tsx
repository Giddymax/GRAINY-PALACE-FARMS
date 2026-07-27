"use client";

import * as React from "react";
import { Analytics } from "@vercel/analytics/react";
import { getStoredConsent, type ConsentValue } from "@/components/consent-banner";

/** Only mounts Vercel Analytics after the visitor accepts the consent banner. */
export function ConsentGatedAnalytics() {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    setEnabled(getStoredConsent() === "accepted");

    function handleChange(e: Event) {
      const detail = (e as CustomEvent<ConsentValue>).detail;
      setEnabled(detail === "accepted");
    }
    window.addEventListener("gpf:consent-changed", handleChange);
    return () => window.removeEventListener("gpf:consent-changed", handleChange);
  }, []);

  if (!enabled) return null;
  return <Analytics />;
}
