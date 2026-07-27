import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, buildFollowUpMessage } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Payment not completed" };

export default async function CheckoutFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const whatsappHref = buildWhatsAppLink(
    buildFollowUpMessage(
      ref ?? "",
      "My card/Mobile Money payment didn't go through — please help me complete my order."
    )
  );

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <XCircle className="size-14 text-destructive" />
      <h1 className="font-heading text-3xl font-semibold">
        Payment not completed
      </h1>
      <p className="text-muted-foreground">
        Your order was saved but the payment didn&apos;t go through. You can
        try again, choose Cash on Delivery instead, or message us on
        WhatsApp and we&apos;ll help you complete it.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="bg-[#25D366] text-white hover:bg-[#1fb958]">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-1 size-4" /> Message us on WhatsApp
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/checkout">Try again</Link>
        </Button>
      </div>
    </div>
  );
}
