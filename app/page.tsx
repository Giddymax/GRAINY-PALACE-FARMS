import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/shop/category-icon";
import { siteConfig } from "@/lib/site-config";
import { categories } from "@/lib/taxonomy";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function HomePage() {
  const featuredCategories = categories.slice(0, 8);
  const whatsappHref = buildWhatsAppLink(
    "Hello Grainy Palace Farm, I'd like to know more about your products."
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-900 text-forest-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-forest-800 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gold-300">
              <ShieldCheck className="size-4" /> {siteConfig.region}
            </span>
            <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
              Certified farm food, delivered across Ghana
            </h1>
            <p className="max-w-xl text-lg text-forest-100">
              {siteConfig.brandPromise} Grains, livestock, fish, seedlings and
              processed foods — grown, raised and packed by Grainy Palace Farm
              Limited.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-gold-500 text-charcoal hover:bg-gold-400">
                <Link href="/shop">
                  Shop Now <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-forest-100/30 bg-transparent text-forest-50 hover:bg-forest-800"
              >
                <Link href="/wholesale">Request Bulk Quote</Link>
              </Button>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-forest-100 hover:text-gold-300"
            >
              <MessageCircle className="size-4" /> Or order directly on WhatsApp
            </a>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-forest-700 to-forest-800 shadow-2xl">
            <div className="flex h-full items-center justify-center">
              <CategoryIcon name="wheat" className="size-32 text-gold-400/80" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust / certification strip */}
      <section className="border-b border-border bg-secondary/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 sm:px-6 lg:px-8">
          {siteConfig.trustBadges.map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground"
            >
              <ShieldCheck className="size-4 text-forest-600" />
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Category teaser */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Shop the full value chain
            </h2>
            <p className="mt-1 text-muted-foreground">
              From certified fields to livestock, fish and seedlings.
            </p>
          </div>
          <Button asChild variant="link" className="hidden shrink-0 sm:inline-flex">
            <Link href="/shop">
              View all categories <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop/${category.slug}`}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-forest-400"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-forest-100 text-forest-700 group-hover:bg-forest-600 group-hover:text-white dark:bg-forest-900 dark:text-forest-300">
                <CategoryIcon name={category.icon} className="size-6" />
              </div>
              <div>
                <h3 className="font-heading font-semibold">{category.name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {category.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/shop">View all categories</Link>
          </Button>
        </div>
      </section>

      {/* Sustainability teaser */}
      <section className="bg-forest-50 dark:bg-forest-950/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
          <div>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              A circular, zero-waste farm
            </h2>
            <p className="mt-3 text-muted-foreground">
              Our integrated crop-livestock-aquaculture system feeds farm
              by-products back into the loop — fish pond effluent nourishes our
              fields, and crop residue feeds our livestock. We pack in
              eco-friendly materials aligned with Ghana&apos;s 2021 Plastics
              Levy, and commit 2% of profits to the communities we farm
              alongside.
            </p>
            <Button asChild variant="link" className="mt-2 px-0">
              <Link href="/sustainability">
                Read our sustainability policy <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Agricultural", detail: "Soil health & crop rotation" },
              { label: "Livestock", detail: "Welfare & antibiotic stewardship" },
              { label: "Aquaculture", detail: "Closed-loop water systems" },
              { label: "Packaging", detail: "Eco-packaging, less plastic" },
            ].map((pillar) => (
              <div
                key={pillar.label}
                className="rounded-xl border border-border bg-card p-4"
              >
                <p className="font-heading font-semibold text-forest-700 dark:text-forest-300">
                  {pillar.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pillar.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-[#25D366]/10 p-8 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="font-heading text-xl font-semibold">
              Prefer to order on WhatsApp?
            </h2>
            <p className="mt-1 text-muted-foreground">
              Message us your order and we&apos;ll confirm price, availability
              and delivery — no account needed.
            </p>
          </div>
          <Button asChild size="lg" className="bg-[#25D366] text-white hover:bg-[#1fb958]">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-1 size-4" /> Chat on WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
