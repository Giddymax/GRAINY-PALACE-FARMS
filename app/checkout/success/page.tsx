import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, buildFollowUpMessage } from "@/lib/whatsapp";
import { ClearCartOnMount } from "@/components/checkout/clear-cart-on-mount";

export const metadata: Metadata = { title: "Order placed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const reference = ref ?? "";

  const whatsappHref = buildWhatsAppLink(
    buildFollowUpMessage(reference, "I've just placed an order on your website.")
  );

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <ClearCartOnMount />
      <CheckCircle2 className="size-14 text-forest-600" />
      <h1 className="font-heading text-3xl font-semibold">Order placed!</h1>
      {reference && (
        <p className="text-muted-foreground">
          Your reference is <span className="font-mono font-semibold text-foreground">{reference}</span>.
          Keep it for tracking your delivery.
        </p>
      )}
      <p className="text-muted-foreground">
        Our team will confirm availability and delivery timing shortly. For
        the fastest update, continue the conversation on WhatsApp.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="bg-[#25D366] text-white hover:bg-[#1fb958]">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-1 size-4" /> Continue on WhatsApp
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
