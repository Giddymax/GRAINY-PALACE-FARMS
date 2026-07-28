/// <reference types="react/canary" />
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ViewTransition } from "react";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { ProductImage } from "@/components/shop/product-image";
import { ProductDetailActions } from "@/components/shop/product-detail-actions";
import { ProductGrid } from "@/components/shop/product-grid";
import { RecordProductView } from "@/components/shop/record-product-view";
import { RecentlyViewed } from "@/components/shop/recently-viewed";
import { Badge } from "@/components/ui/badge";
import { formatGHS } from "@/lib/format";
import { productJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${siteConfig.shortName}`,
      description: product.description,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const related = await getRelatedProducts(product);
  const jsonLd = productJsonLd({
    name: product.name,
    slug: product.slug,
    description: product.description,
    imageUrl: product.image_url,
    price: product.price,
    isAvailable: product.is_available,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/shop" className="hover:underline">Shop</Link>
        <ChevronRight className="size-3.5" />
        {category && (
          <>
            <Link href={`/shop/${category.slug}`} className="hover:underline">{category.name}</Link>
            <ChevronRight className="size-3.5" />
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          <ViewTransition name={`product-photo-${product.id}`}>
            <ProductImage
              src={product.image_url}
              alt={product.name}
              categoryIcon={category?.icon}
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </ViewTransition>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <h1 className="font-heading text-3xl font-semibold">{product.name}</h1>
          <p className="text-2xl font-semibold text-forest-700 dark:text-forest-300">
            {formatGHS(product.price)}{" "}
            <span className="text-base font-normal text-muted-foreground">/ {product.unit}</span>
          </p>
          <p className="text-muted-foreground">{product.description}</p>

          {product.is_available &&
            product.stock_quantity !== null &&
            product.stock_quantity > 0 &&
            product.stock_quantity <= 5 && (
              <p className="text-sm font-medium text-destructive">
                Only {product.stock_quantity} left in stock — order soon.
              </p>
            )}

          <div className="flex items-start gap-2 rounded-lg bg-forest-50 p-3 text-sm dark:bg-forest-950/40">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-forest-600" />
            <span>{product.traceability_note}</span>
          </div>

          <ProductDetailActions product={product} />

          <p className="text-xs text-muted-foreground">
            Bulk order? <Link href="/wholesale" className="underline">Request a wholesale quote</Link>{" "}
            instead of ordering through the cart.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-heading text-2xl font-semibold">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}

      <RecentlyViewed excludeSlug={product.slug} />
      <RecordProductView
        item={{
          slug: product.slug,
          name: product.name,
          price: product.price,
          unit: product.unit,
          imageUrl: product.image_url,
        }}
      />
    </div>
  );
}
