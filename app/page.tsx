import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/layout/wave-divider";
import { siteConfig } from "@/lib/site-config";
import { categories } from "@/lib/taxonomy";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getCategoryThumbnails } from "@/lib/data/products";
import { getHeroSlides, getPageHero } from "@/lib/data/misc";
import { HeroCarousel, type HeroSlideData } from "@/components/home/hero-carousel";

const FALLBACK_SLIDE: HeroSlideData = {
  id: "fallback",
  title: "Certified farm food, delivered across Ghana",
  subtitle: siteConfig.brandPromise,
  image_url: null,
  cta_label: "Shop Now",
  cta_href: "/shop",
};

export default async function HomePage() {
  const featuredCategories = categories.slice(0, 8);
  const [thumbnails, heroSlides, heroBackground] = await Promise.all([
    getCategoryThumbnails(),
    getHeroSlides(),
    getPageHero("home-hero-bg"),
  ]);
  const slides = heroSlides.length > 0 ? heroSlides : [FALLBACK_SLIDE];
  const whatsappHref = buildWhatsAppLink(
    "Hello Grainy Palace Farms, I'd like to know more about your products."
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-900 pb-14 text-forest-50">
        {heroBackground?.image_url && (
          <>
            <Image
              src={heroBackground.image_url}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            {/* Light directional tint — just enough behind the text column for
                contrast, fading to fully clear by the image side. */}
            <div className="absolute inset-0 bg-gradient-to-r from-forest-950/80 via-forest-950/40 to-transparent md:via-forest-950/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-transparent" />
          </>
        )}
        <div className="relative">
          <HeroCarousel slides={slides} />
        </div>
        <WaveDivider className="absolute inset-x-0 bottom-0 h-14 w-full text-background" fill="currentColor" />
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
          {featuredCategories.map((category) => {
            const thumbnail = thumbnails[category.slug];
            return (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={category.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-forest-100 to-gold-100 dark:from-forest-900 dark:to-forest-800" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold">{category.name}</h3>
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                    {category.blurb}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/shop">View all categories</Link>
          </Button>
        </div>
      </section>

      {/* Sustainability teaser */}
      <section className="relative bg-forest-50 pt-14 dark:bg-forest-950/40">
        <WaveDivider className="absolute inset-x-0 top-0 h-14 w-full -translate-y-full text-forest-50 dark:text-forest-950/40" fill="currentColor" />
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
                className="rounded-2xl border border-border bg-card p-4"
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
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#25D366]/10 p-8 text-center sm:flex-row sm:text-left">
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
