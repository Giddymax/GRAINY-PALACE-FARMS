/**
 * Locale constants shared by both server (i18n/request.ts) and client
 * (language switcher) code. Kept separate from request.ts because that
 * file imports next/headers, which cannot end up in a client bundle.
 */
export const locales = ["en", "tw", "ga", "ee", "ha"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  tw: "Twi",
  ga: "Ga",
  ee: "Ewe",
  ha: "Hausa",
};

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
