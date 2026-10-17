"use client";

import * as React from "react";
import type { PublicContactSettings } from "@/lib/data/site-content";

const ContactSettingsContext = React.createContext<PublicContactSettings | null>(null);

export function ContactSettingsProvider({
  settings,
  children,
}: {
  settings: PublicContactSettings;
  children: React.ReactNode;
}) {
  return (
    <ContactSettingsContext.Provider value={settings}>
      {children}
    </ContactSettingsContext.Provider>
  );
}

export function usePublicContactSettings() {
  const settings = React.useContext(ContactSettingsContext);
  if (!settings) throw new Error("Contact settings provider is missing.");
  return settings;
}
