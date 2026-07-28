"use client";

import { track } from "@vercel/analytics";
import { getStoredConsent } from "@/lib/consent";

/** Lightweight, privacy-friendly custom-event tracking — only fires once the visitor has opted in. */
export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  if (getStoredConsent() !== "accepted") return;
  if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS !== "true") return;
  track(name, props);
}
