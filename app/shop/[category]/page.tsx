import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getCategoryBySlug, categories } from "@/lib/taxonomy";
import { getProducts, getPriceRange } from "@/lib/data/products";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ProductGrid } from "@/components/shop/product-grid";
import { ShopPagination } from "@/components/shop/shop-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Params = { category: string };
type SearchParams = {
  q?: string;
  subcategory?: string;
  sort?: string;
  tags?: string;
  available?: string;
  min?: string;
  max?: string;
  page?: string;
};

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.blurb} Shop ${category.name.toLowerCase()} from Grainy Palace Farm, delivered across Ghana.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const sp = await searchParams;
  const priceRange = await getPriceRange();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">{category.name}</h1>
          <p className="mt-1 text-muted-foreground">{category.blurb}</p>
        </div>
        {["grains-cereals", "meat-livestock", "fish-seafood"].includes(slug) && (
          <Link
            href="/wholesale"
            className="shrink-0 rounded-lg bg-gold-100 px-4 py-2 text-sm font-medium text-gold-900 hover:bg-gold-200 dark:bg-gold-900/40 dark:text-gold-100"
          >
            Buying in bulk? Request a wholesale price →
          </Link>
        )}
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {category.subcategories.map((sub) => (
          <Link
            key={sub.slug}
            href={`/shop/${slug}?subcategory=${sub.slug}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium",
              sp.subcategory === sub.slug
                ? "border-forest-600 bg-forest-600 text-white"
                : "border-border bg-card hover:border-forest-400"
            )}
          >
            {sub.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ShopFilters priceMin={Math.floor(priceRange.min)} priceMax={Math.ceil(priceRange.max)} />
        <Suspense fallback={<CategoryGridSkeleton />}>
          <CategoryResults categorySlug={slug} params={sp} />
        </Suspense>
      </div>
    </div>
  );
}

async function CategoryResults({
  categorySlug,
  params,
}: {
  categorySlug: string;
  params: SearchParams;
}) {
  const page = Number(params.page ?? "1") || 1;
  const pageSize = 24;
  const { products, total } = await getProducts({
    category: categorySlug,
    subcategory: params.subcategory,
    search: params.q,
    tags: params.tags?.split(",").filter(Boolean),
    availableOnly: params.available === "1",
    minPrice: params.min ? Number(params.min) : undefined,
    maxPrice: params.max ? Number(params.max) : undefined,
    sort: (params.sort as never) ?? "newest",
    page,
    pageSize,
  });

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        {total} product{total === 1 ? "" : "s"}
      </p>
      <ProductGrid products={products} />
      <ShopPagination page={page} pageSize={pageSize} total={total} />
    </div>
  );
}

function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
