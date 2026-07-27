"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppFloatButton() {
  const pathname = usePathname();
  // Hide on admin/partner dashboards where it would overlap operational UI.
  if (pathname?.startsWith("/admin")) return null;

  const href = buildWhatsAppLink(
    "Hello Grainy Palace Farm, I have a question about your products."
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Grainy Palace Farm on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none [padding-bottom:env(safe-area-inset-bottom)]"
    >
      <MessageCircle className="size-7" fill="currentColor" />
    </a>
  );
}
