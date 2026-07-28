import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-forest-100 dark:bg-forest-900/40">
        <WifiOff className="size-8 text-forest-600 dark:text-forest-300" />
      </span>
      <h1 className="font-heading text-2xl font-semibold">You&apos;re offline</h1>
      <p className="text-muted-foreground">
        It looks like you&apos;ve lost your connection. Pages you&apos;ve already visited
        may still be available — everything else needs the internet back.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button variant="outline" asChild>
          <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
            Order on WhatsApp instead
          </a>
        </Button>
      </div>
    </div>
  );
}
