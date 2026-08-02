import type { Metadata } from "next";
import Link from "next/link";
import { Trees } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeroImage } from "@/components/layout/page-hero-image";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { WholesaleQuoteForm } from "@/components/forms/wholesale-quote-form";

export const metadata: Metadata = {
  title: "Seedlings",
  description:
    "Tree and economic plant seedlings from Grainy Palace Farms' nursery — oil palm, cocoa, cashew, mango, moringa, teak and agroforestry mixes.",
};

export default function SeedlingsPage() {
  const category = getCategoryBySlug("seedlings");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeroImage slug="seedlings" />
      <div className="mb-12 text-center">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
          Tree &amp; Economic Plant Seedlings
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          From our nursery to your plot — certified seedlings for the
          plantation, agroforestry and orchard value chain.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/shop/seedlings">Shop all seedlings</Link>
        </Button>
      </div>

      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {category?.subcategories.map((sub) => (
          <div key={sub.slug} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center">
            <Trees className="size-6 text-forest-600" />
            <h3 className="font-heading text-sm font-semibold">{sub.name}</h3>
          </div>
        ))}
      </div>

      <div className="mb-16 rounded-2xl bg-forest-50 p-8 dark:bg-forest-950/40">
        <h2 className="mb-2 font-heading text-xl font-semibold">
          Why plant with certified seedlings?
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Our oil palm, cocoa and cashew seedlings are propagated from
          disease-tolerant parent stock and hardened off in our nursery
          before sale, giving them a stronger start than uncertified
          roadside seedlings. Fruit varieties (mango, citrus) are grafted
          for earlier fruiting. We also supply mixed agroforestry packs for
          farmers diversifying income across timber, fruit and shade crops
          on the same plot.
        </p>
      </div>

      <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold">
          Bulk seedling orders for plantation projects
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Planning a large-scale planting project? Request bulk pricing on
          any of our seedling varieties.
        </p>
        <WholesaleQuoteForm defaultRequestType="bulk" defaultProduct="Seedlings" />
      </div>
    </div>
  );
}
