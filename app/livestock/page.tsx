import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Egg, Beef, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubscriptionForm } from "@/components/forms/subscription-form";
import { WholesaleQuoteForm } from "@/components/forms/wholesale-quote-form";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Livestock",
  description:
    "Poultry, cage-free eggs, goats, sheep, pork, rabbit and guinea fowl from Grainy Palace Farms — humanely raised with antibiotic stewardship.",
};

export default function LivestockPage() {
  const whatsappHref = buildWhatsAppLink(
    "Hello Grainy Palace Farms, I'd like to place a festive-season live-animal order."
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">Livestock</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Poultry, small ruminants, pork and rabbit — raised with welfare and
          food-safety standards you can trace back to our farm.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/shop/poultry-eggs">Shop poultry &amp; eggs</Link>
        </Button>
      </div>

      <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Poultry", body: "Cage-free layers, dressed and frozen broilers, guinea fowl." },
          { title: "Goats & Sheep", body: "Chevon and mutton, halal-handled from arrival to dressing." },
          { title: "Pork", body: "From our own piggery, chilled for same-week delivery." },
          { title: "Rabbit", body: "A lean, low-fat meat option raised on our small ruminant unit." },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mb-16 grid gap-8 rounded-2xl bg-forest-50 p-8 dark:bg-forest-950/40 md:grid-cols-2">
        <div className="flex gap-3">
          <ShieldCheck className="size-6 shrink-0 text-forest-600" />
          <div>
            <h3 className="font-heading font-semibold">Antibiotic stewardship</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We follow a strict withdrawal-period protocol and avoid
              routine antibiotic use for growth promotion — treatment is
              reserved for diagnosed illness, under veterinary guidance from
              our VSD-registered partners.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Beef className="size-6 shrink-0 text-forest-600" />
          <div>
            <h3 className="font-heading font-semibold">Halal handling</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Our goat and sheep are processed under halal-certified
              procedures. Halal beef is in development as part of our Phase
              2 product range.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Egg className="size-5 text-forest-600" />
            <h2 className="font-heading text-lg font-semibold">Egg &amp; produce subscription</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Get cage-free eggs, vegetables or fresh tilapia delivered on a
            weekly or monthly schedule — no need to reorder every time.
          </p>
          <SubscriptionForm />
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">
            Festive-season live-animal orders
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Ordering a live goat, sheep or broiler flock for Christmas, Eid
            or a naming ceremony? Order at least 5 days ahead to guarantee
            availability.
          </p>
          <WholesaleQuoteForm defaultRequestType="bulk" defaultProduct="Live animals" />
          <Button asChild variant="outline" className="mt-3 w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-1 size-4" /> Or order directly on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
