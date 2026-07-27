import type { Metadata } from "next";
import Link from "next/link";
import { Fish as FishIcon, Recycle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WholesaleQuoteForm } from "@/components/forms/wholesale-quote-form";

export const metadata: Metadata = {
  title: "Fish & Aquaculture",
  description:
    "Fresh, smoked and frozen tilapia and catfish from Grainy Palace Farm's integrated aquaculture ponds, with full farm-to-table traceability.",
};

export default function FishPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
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
            <FishIcon className="mb-2 size-6 text-forest-600" />
            <h3 className="font-heading font-semibold">{item.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="mb-16 grid gap-8 rounded-2xl bg-forest-50 p-8 dark:bg-forest-950/40 md:grid-cols-2">
        <div className="flex gap-3">
          <Recycle className="size-6 shrink-0 text-forest-600" />
          <div>
            <h3 className="font-heading font-semibold">An integrated, circular system</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Nutrient-rich pond water periodically irrigates our adjacent
              crop plots, cutting our need for synthetic fertiliser — one
              part of the farm feeding another, rather than water going to
              waste.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <ShieldCheck className="size-6 shrink-0 text-forest-600" />
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
