"use client";

import { Share2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { toast } from "sonner";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const whatsappHref = buildWhatsAppLink(`${title}\n\n${url}`);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled — no-op
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" className="border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10" asChild>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
          Share on WhatsApp
        </a>
      </Button>
      <Button size="sm" variant="outline" onClick={handleShare}>
        {typeof navigator !== "undefined" && "share" in navigator ? (
          <Share2 className="size-4" />
        ) : (
          <LinkIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}
