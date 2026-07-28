"use client";

const CONSENT_KEY = "gpf-analytics-consent";

export type ConsentChoice = "accepted" | "necessary-only";

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "necessary-only" ? value : null;
}

export function storeConsent(choice: ConsentChoice) {
  window.localStorage.setItem(CONSENT_KEY, choice);
  window.dispatchEvent(new CustomEvent("gpf-consent-change", { detail: choice }));
}
