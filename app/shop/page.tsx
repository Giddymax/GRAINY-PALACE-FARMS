import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getProducts, getPriceRange } from "@/lib/data/products";
import { categories } from "@/lib/taxonomy";
import { CategoryIcon } from "@/components/shop/category-icon";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ProductGrid } from "@/components/shop/product-grid";
import { ShopPagination } from "@/components/shop/shop-pagination";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Grainy Palace Farm's full catalogue: grains, vegetables, livestock, fish, seedlings, processed foods and farm inputs — all with GHS pricing and farm-to-fork traceability.",
};

type ShopSearchParams = {
  q?: string;
  category?: string;
  sort?: string;
  tags?: string;
  available?: string;
  min?: string;
  max?: string;
  page?: string;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;
  const priceRange = await getPriceRange();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold">Shop</h1>
        <p className="mt-1 text-muted-foreground">
          Certified grains, livestock, fish, seedlings and processed foods —
          delivered across Ghana.
        </p>
      </div>

      <div className="mb-10 flex gap-3 overflow-x-auto pb-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-forest-400"
          >
            <CategoryIcon name={c.icon} className="size-4 text-forest-600" />
            {c.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ShopFilters priceMin={Math.floor(priceRange.min)} priceMax={Math.ceil(priceRange.max)} />
        <Suspense fallback={<ShopGridSkeleton />}>
          <ShopResults params={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function ShopResults({ params }: { params: ShopSearchParams }) {
  const page = Number(params.page ?? "1") || 1;
  const pageSize = 24;
  const { products, total } = await getProducts({
    search: params.q,
    category: params.category,
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

function ShopGridSkeleton() {
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
