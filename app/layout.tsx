import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart/context";
import { IntlClientRoot } from "@/components/intl-client-root";
import { SiteChrome } from "@/components/layout/site-chrome";
import { siteConfig } from "@/lib/site-config";
import { organizationJsonLd } from "@/lib/structured-data";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { AnalyticsGate } from "@/components/analytics/analytics-gate";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  manifest: "/manifest.webmanifest",
  keywords: [
    "Grainy Palace Farm",
    "Ghana agribusiness",
    "buy grains Ghana",
    "farm to table Ghana",
    "certified farm produce",
    "Ghana livestock supplier",
  ],
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7ee" },
    { media: "(prefers-color-scheme: dark)", color: "#161c17" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {/* Blocking, dependency-free: sets the correct light/dark class before
            hydration so there's no flash. Rendered as plain SSR body content
            (not inside a client component) — see components/theme-provider.tsx. */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        <IntlClientRoot>
          <ThemeProvider>
            <TooltipProvider delayDuration={200}>
              <CartProvider>
                <a href="#main-content" className="skip-link">
                  Skip to content
                </a>
                <SiteChrome>{children}</SiteChrome>
                <Toaster position="top-right" richColors closeButton />
                <ServiceWorkerRegister />
                <InstallPrompt />
                <ConsentBanner />
                <AnalyticsGate />
              </CartProvider>
            </TooltipProvider>
          </ThemeProvider>
        </IntlClientRoot>
      </body>
    </html>
  );
}
