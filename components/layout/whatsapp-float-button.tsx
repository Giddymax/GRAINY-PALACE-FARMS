"use client";

import { usePathname } from "next/navigation";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppFloatButton({ phone }: { phone: string }) {
  const pathname = usePathname();
  // Hide on admin/partner dashboards where it would overlap operational UI.
  if (pathname?.startsWith("/admin")) return null;

  const href = buildWhatsAppLink(
    "Hello Grainy Palace Farms, I have a question about your products.",
    phone
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Grainy Palace Farms on WhatsApp"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 z-50 rounded-full bg-[#25D366] px-3 py-2.5 text-xs font-semibold text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none sm:right-5 sm:px-4 sm:py-3 sm:text-sm"
    >
      Chat on WhatsApp
    </a>
  );
}
