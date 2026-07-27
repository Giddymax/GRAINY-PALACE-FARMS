"use client";

import * as React from "react";
import { NextIntlClientProvider } from "next-intl";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import enMessages from "@/messages/en.json";

type Messages = typeof enMessages;

const messageLoaders: Record<Locale, () => Promise<{ default: Messages }>> = {
  en: () => Promise.resolve({ default: enMessages }),
  tw: () => import("@/messages/tw.json"),
  ga: () => import("@/messages/ga.json"),
  ee: () => import("@/messages/ee.json"),
  ha: () => import("@/messages/ha.json"),
};

function readCookieLocale(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

const SetLocaleContext = React.createContext<(locale: Locale) => void>(() => {});

/** Client-only locale switching so marketing pages stay statically
 *  prerenderable — reading the locale via next/headers' cookies() in the
 *  root layout would force every route in the app to render dynamically. */
export function IntlClientRoot({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(defaultLocale);
  const [messages, setMessages] = React.useState<Messages>(enMessages);

  const applyLocale = React.useCallback((next: Locale) => {
    messageLoaders[next]().then((mod) => {
      setLocaleState(next);
      setMessages(mod.default);
      document.documentElement.lang = next;
    });
  }, []);

  React.useEffect(() => {
    const cookieLocale = readCookieLocale();
    if (isLocale(cookieLocale) && cookieLocale !== defaultLocale) {
      applyLocale(cookieLocale);
    }
  }, [applyLocale]);

  return (
    <SetLocaleContext.Provider value={applyLocale}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Accra">
        {children}
      </NextIntlClientProvider>
    </SetLocaleContext.Provider>
  );
}

export function useSetLocale() {
  return React.useContext(SetLocaleContext);
}
