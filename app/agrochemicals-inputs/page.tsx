import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeroImage } from "@/components/layout/page-hero-image";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { getSiteContentSection } from "@/lib/data/site-content";
import { agrochemicalsInputsDefaults } from "@/lib/agrochemicals-inputs-content";

async function getPageContent() {
  return { ...agrochemicalsInputsDefaults, ...await getSiteContentSection("agrochemicals_inputs") };
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent();
  return { title: content.meta_title, description: content.meta_description };
}

export default async function AgrochemicalsInputsPage() {
  const category = getCategoryBySlug("agrochemicals-inputs");
  const content = await getPageContent();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeroImage slug="agrochemicals-inputs" />

      <section className="mx-auto mb-12 max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest-700 dark:text-forest-300">
          {content.eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          {content.intro}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href={content.shop_cta_href}>{content.shop_cta_label}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={content.bulk_cta_href}>{content.bulk_cta_label}</Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="inputs-range-heading" className="mb-12">
        <h2 id="inputs-range-heading" className="mb-5 text-center font-heading text-2xl font-semibold">
          {content.range_heading}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(category?.subcategories ?? []).map((item, index) => {
            const details = {
              title: content[`card_${index}_title`] || item.name,
              description:
                content[`card_${index}_description`] ||
                "Browse available products and supplies in this category.",
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
        <h2 className="font-heading text-xl font-semibold">{content.responsible_heading}</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          {content.responsible_description}
        </p>
        <Button asChild variant="link" className="mt-2 px-0">
          <Link href={content.contact_cta_href}>{content.contact_cta_label}</Link>
        </Button>
      </section>
    </div>
  );
}
