import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, buildFollowUpMessage } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Request received" };

const copyByType: Record<string, { title: string; body: (topic?: string) => string }> = {
  quote: {
    title: "Quote request received",
    body: (topic) =>
      `Thanks — we've received your enquiry${topic ? ` about ${topic}` : ""}. Our wholesale team will get back to you shortly.`,
  },
  subscription: {
    title: "Subscription request received",
    body: (topic) => `Thanks — we've received your subscription request${topic ? ` for ${topic}` : ""}. We'll confirm details on WhatsApp or by phone.`,
  },
  outgrower: {
    title: "Outgrower application received",
    body: (topic) => `Thanks for applying to our outgrower scheme${topic ? ` for ${topic}` : ""}. Our agronomy team reviews applications ahead of each planting season.`,
  },
  job: {
    title: "Application received",
    body: () => "Thanks for applying. Our HR team reviews every application and will contact shortlisted candidates.",
  },
  lab: {
    title: "Sample submitted",
    body: () => "Your sample has been logged. Use your reference to track results on our Lab Services results tracker.",
  },
  contact: {
    title: "Message sent",
    body: () => "Thanks for reaching out — we'll respond as soon as possible.",
  },
};

export default async function EnquirySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; topic?: string; ref?: string }>;
}) {
  const { type, topic, ref } = await searchParams;
  const copy = copyByType[type ?? ""] ?? copyByType.contact;

  const whatsappHref = buildWhatsAppLink(
    ref
      ? buildFollowUpMessage(ref, "I just submitted a request on your website.")
      : `Hello Grainy Palace Farm, I just submitted a request on your website${topic ? ` about ${topic}` : ""}.`
  );

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <CheckCircle2 className="size-14 text-forest-600" />
      <h1 className="font-heading text-3xl font-semibold">{copy.title}</h1>
      {ref && (
        <p className="text-muted-foreground">
          Reference: <span className="font-mono font-semibold text-foreground">{ref}</span>
        </p>
      )}
      <p className="text-muted-foreground">{copy.body(topic)}</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="bg-[#25D366] text-white hover:bg-[#1fb958]">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-1 size-4" /> Continue on WhatsApp
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
