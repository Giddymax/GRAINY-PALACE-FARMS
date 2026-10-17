import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/layout/wave-divider";
import { siteConfig } from "@/lib/site-config";
import { categories } from "@/lib/taxonomy";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getCategoryThumbnails } from "@/lib/data/products";
import { getGalleryItems, getHeroSlides, getPageHero } from "@/lib/data/misc";
import { getPublishedArticles } from "@/lib/data/articles";
import { ArticleCard } from "@/components/articles/article-card";
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
  const featuredCategories = categories.slice(0, 7);
  const agroInputsCategory = categories.find(
    (category) => category.slug === "agrochemicals-inputs"
  );
  if (agroInputsCategory) featuredCategories.push(agroInputsCategory);
  const [thumbnails, heroSlides, heroBackground, gallery, guides] = await Promise.all([
    getCategoryThumbnails(),
    getHeroSlides(),
    getPageHero("home-hero-bg"),
    getGalleryItems(undefined, 4),
    getPublishedArticles({ pageSize: 3 }),
  ]);
  const slides = heroSlides.length > 0 ? heroSlides : [FALLBACK_SLIDE];
  const whatsappHref = buildWhatsAppLink(
    "Hello Grainy Palace Farms, I'd like to know more about your products."
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white pb-14 text-forest-950">
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
                contrast (dark-green text needs a light backdrop), fading to
                fully clear by the image side. */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent md:via-white/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
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
              {badge}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-700 dark:text-forest-300">Rooted in the Eastern Region</p>
          <h2 className="mt-1 font-heading text-xl font-semibold sm:text-2xl">Growing with Ghana, serving nationwide</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Explore our farm locations, GPS points and directions, or contact our team to confirm access and delivery details.</p>
        </div>
        <Button asChild variant="outline"><Link href="/farm-locations">Explore our locations</Link></Button>
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
              View all categories
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featuredCategories.map((category) => {
            const thumbnail = thumbnails[category.slug];
            return (
              <Link
                key={category.slug}
                href={
                  category.slug === "agrochemicals-inputs"
                    ? "/agrochemicals-inputs"
                    : `/shop/${category.slug}`
                }
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

      {/* Farm-to-table and proof points */}
      <section className="bg-white py-14 dark:bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-forest-700 dark:text-forest-300">How we work</p>
            <h2 className="mt-1 font-heading text-2xl font-semibold sm:text-3xl">From farm to your table</h2>
            <p className="mt-2 text-muted-foreground">See where our food begins, how to check available product information, and how to reach our team.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { number: "01", title: "Grown and raised in Ghana", body: "Our integrated agribusiness is based in the Eastern Region and works across crops, livestock, fish and processed foods.", href: "/about", link: "Our story" },
              { number: "02", title: "Handled with care", body: "For fish, our handling process starts with early-morning harvest and immediate transfer into ice-slurry crates.", href: "/fish", link: "Fish handling" },
              { number: "03", title: "Check product details", body: "Use batch traceability and our lab services pages to find the information available for products and samples.", href: "/traceability", link: "Traceability" },
              { number: "04", title: "Choose how to receive it", body: "Select Accra delivery, nationwide courier or farm-gate pickup at checkout; our team confirms delivery timing after an order.", href: "/checkout", link: "Delivery at checkout" },
            ].map((step) => (
              <article key={step.number} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">{step.number}</p>
                <h3 className="mt-3 font-heading text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                <Link href={step.href} className="mt-4 inline-block text-sm font-semibold text-forest-700 hover:underline dark:text-forest-300">{step.link}</Link>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
            <Button asChild variant="outline"><Link href="/about#story">Our standards</Link></Button>
            <Button asChild variant="outline"><Link href="/lab-services">Lab services</Link></Button>
            <Button asChild variant="outline"><Link href="/contact">Talk to our team</Link></Button>
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-forest-700 dark:text-forest-300">On the ground</p>
              <h2 className="mt-1 font-heading text-2xl font-semibold sm:text-3xl">A look at our farms</h2>
            </div>
            <Button asChild variant="link" className="hidden sm:inline-flex"><Link href="/about">More about us</Link></Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {gallery.slice(0, 4).map((item) => (
              <div key={item.id} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                <Image src={item.image_url} alt={item.title ?? "Grainy Palace Farms"} fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover" />
                {item.title && <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 text-sm font-medium text-white">{item.title}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Practical guides */}
      <section className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-forest-700 dark:text-forest-300">Learn and explore</p>
              <h2 className="mt-1 font-heading text-2xl font-semibold sm:text-3xl">Useful guides from our team</h2>
              <p className="mt-2 text-muted-foreground">Read the latest articles, then explore related products and farm supplies.</p>
            </div>
            <Button asChild variant="outline"><Link href="/articles">Visit the Knowledge Hub</Link></Button>
          </div>
          {guides.articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guides.articles.map((article) => <ArticleCard key={article.id} article={article} category={null} />)}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">Our farming, food and nutrition guides are being prepared. Browse the Knowledge Hub for new articles.</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline"><Link href="/agrochemicals-inputs">Explore crop inputs</Link></Button>
            <Button asChild variant="outline"><Link href="/shop/roots-tubers">Shop roots, tubers &amp; plantain</Link></Button>
            <Button asChild variant="outline"><Link href="/shop">Browse all products</Link></Button>
          </div>
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
              We want agriculture and its value chain to be attractive to young
              people and all Ghanaians. Our environmental, social and economic
              sustainability approach includes an integrated crop-livestock-
              aquaculture system that feeds farm
              by-products back into the loop — fish pond effluent nourishes our
              fields, and crop residue feeds our livestock. We pack in
              eco-friendly materials aligned with Ghana&apos;s 2021 Plastics
              Levy, and commit 2% of profits to the communities we farm
              alongside.
            </p>
            <Button asChild variant="link" className="mt-2 px-0">
              <Link href="/sustainability">
                Read our sustainability policy
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
              Chat on WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
