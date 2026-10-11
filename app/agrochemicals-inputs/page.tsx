import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeroImage } from "@/components/layout/page-hero-image";
import { getCategoryBySlug } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Agrochemicals & Farm Inputs",
  description:
    "Browse fertilisers, soil amendments, crop-protection products, seeds and practical farm supplies from Grainy Palace Farms.",
};

const guidance = [
  {
    title: "Soil nutrition",
    description:
      "Fertilisers and soil amendments to support crop nutrition and soil management.",
  },
  {
    title: "Crop protection",
    description:
      "Crop-care products for managing common pest, weed and disease pressures.",
  },
  {
    title: "Seeds & planting materials",
    description:
      "Planting inputs for farmers preparing fields and planning the next growing season.",
  },
  {
    title: "Farm tools & protective equipment",
    description:
      "Practical supplies and protective equipment for day-to-day farm work.",
  },
];

export default function AgrochemicalsInputsPage() {
  const category = getCategoryBySlug("agrochemicals-inputs");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeroImage slug="agrochemicals-inputs" />

      <section className="mx-auto mb-12 max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest-700 dark:text-forest-300">
          Farm inputs
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
          Agrochemicals &amp; Farm Inputs
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Find crop-care products and practical supplies for your farm, from soil
          nutrition and crop protection to seeds and protective equipment.
          Product availability and specifications are shown in the shop.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/shop/agrochemicals-inputs">Shop agrochemicals &amp; inputs</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/wholesale">Ask about bulk supply</Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="inputs-range-heading" className="mb-12">
        <h2 id="inputs-range-heading" className="mb-5 text-center font-heading text-2xl font-semibold">
          Explore the range
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(category?.subcategories ?? []).map((item, index) => {
            const details = guidance[index] ?? {
              title: item.name,
              description: "Browse available products and supplies in this category.",
            };

            return (
              <Link
                key={item.slug}
                href={`/shop/agrochemicals-inputs?subcategory=${item.slug}`}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-forest-400 hover:bg-muted/40"
              >
                <h3 className="font-heading font-semibold">{details.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {details.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl bg-forest-50 p-6 dark:bg-forest-950/40 sm:p-8">
        <h2 className="font-heading text-xl font-semibold">Choose products responsibly</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Always follow the product label and local agricultural guidance for
          the crop, application rate, protective equipment, storage and disposal.
          Check the product listing or contact our team if you need specifications
          or help choosing an input for your operation.
        </p>
        <Button asChild variant="link" className="mt-2 px-0">
          <Link href="/contact">Contact our team</Link>
        </Button>
      </section>
    </div>
  );
}
