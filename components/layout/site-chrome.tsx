"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFloatButton } from "@/components/layout/whatsapp-float-button";
import { ContactSettingsProvider } from "@/components/contact-settings-provider";
import type { PublicContactSettings } from "@/lib/data/site-content";

/**
 * /admin gets its own shell (a sidebar, added in Phase 6) instead of the
 * public marketing header/footer/WhatsApp button — this is the single
 * place that decides which chrome wraps a given route.
 */
export function SiteChrome({
  children,
  footerContent,
  contactSettings,
}: {
  children: React.ReactNode;
  footerContent: Record<string, string>;
  contactSettings: PublicContactSettings;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <ContactSettingsProvider settings={contactSettings}>
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </ContactSettingsProvider>
    );
  }

  return (
    <ContactSettingsProvider settings={contactSettings}>
      <>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter content={footerContent} contactSettings={contactSettings} />
        <WhatsAppFloatButton phone={contactSettings.whatsapp} />
      </>
    </ContactSettingsProvider>
  );
}
