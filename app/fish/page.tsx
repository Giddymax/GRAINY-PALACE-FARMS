import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeroImage } from "@/components/layout/page-hero-image";
import { WholesaleQuoteForm } from "@/components/forms/wholesale-quote-form";

export const metadata: Metadata = {
  title: "Fish & Aquaculture",
  description:
    "Fresh, smoked and frozen tilapia and catfish from Grainy Palace Farms' integrated aquaculture ponds, with full farm-to-table traceability.",
};

export default function FishPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeroImage slug="fish" />
      <div className="mb-12 text-center">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
          Fish &amp; Aquaculture
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Tilapia and catfish raised in our integrated fish-crop ponds —
          fresh, smoked or frozen, delivered on ice with full traceability.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/shop/fish-seafood">Shop fish &amp; seafood</Link>
        </Button>
      </div>

      <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "Fresh Tilapia", note: "Harvested at dawn, delivered same-day on ice." },
          { name: "Fresh Catfish", note: "From our integrated ponds, delivered on ice." },
          { name: "Smoked Catfish", note: "Traditionally smoked, aflatoxin-tested." },
          { name: "Frozen Tilapia Fillets", note: "Boneless, individually quick-frozen." },
        ].map((item) => (
          <div key={item.name} className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading font-semibold">{item.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </div>

      <section className="mb-16 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest-700 dark:text-forest-300">Cold-chain handling</p>
        <h2 className="mt-1 font-heading text-xl font-semibold">From pond to ice slurry</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Fish are harvested early in the morning, when water and air temperatures are lowest. From the moment they leave the pond, they go into ice-slurry crates and are never left at ambient temperature.
        </p>
      </section>

      <div className="mb-16 grid gap-8 rounded-2xl bg-forest-50 p-8 dark:bg-forest-950/40 md:grid-cols-2">
        <div>
          <h3 className="font-heading font-semibold">An integrated, circular system</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Nutrient-rich pond water periodically irrigates our adjacent
            crop plots, cutting our need for synthetic fertiliser — one
            part of the farm feeding another, rather than water going to
            waste.
          </p>
        </div>
        <div>
          <h3 className="font-heading font-semibold">Farm-to-table traceability</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Every batch carries a code you can look up on our{" "}
            <Link href="/traceability" className="underline">
              traceability page
            </Link>{" "}
            to see the pond of origin, harvest date and lab results.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold">
          Wholesale fish supply
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Supplying a restaurant, hotel or processor? Request volume pricing
          on fresh, smoked or frozen fish.
        </p>
        <WholesaleQuoteForm defaultRequestType="wholesale" defaultProduct="Fish & seafood" />
      </div>
    </div>
  );
}
