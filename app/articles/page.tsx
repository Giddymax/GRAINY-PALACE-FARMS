import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { BookOpen } from "lucide-react";
import {
  getArticleCategories,
  getPublishedArticles,
  getFeaturedArticle,
  attachCategory,
} from "@/lib/data/articles";
import { ArticleCard } from "@/components/articles/article-card";
import { PageHeroImage } from "@/components/layout/page-hero-image";
import { ShopPagination } from "@/components/shop/shop-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDate, formatReadingTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Knowledge Hub",
  description:
    "Nutrition, food safety, sustainable agriculture, livestock welfare, aquaculture, farming tips and recipes from Grainy Palace Farms.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const [categories, featured] = await Promise.all([
    getArticleCategories(),
    getFeaturedArticle(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeroImage slug="articles" />
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold">Knowledge Hub</h1>
        <p className="mt-1 text-muted-foreground">
          Nutrition, food safety, sustainable agriculture and farming guides
          from our team.
        </p>
      </div>

      {featured && !params.q && !params.category && (
        <Link
          href={`/articles/${featured.slug}`}
          className="mb-10 flex flex-col overflow-hidden rounded-2xl border border-border bg-card md:flex-row"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted md:aspect-auto md:w-2/5">
            {featured.cover_image ? (
              <Image
                src={featured.cover_image}
                alt={featured.title}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-forest-100 to-gold-100 dark:from-forest-900 dark:to-forest-800">
                <BookOpen className="size-10 text-forest-600 dark:text-forest-300" />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-8">
            <span className="w-fit rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-800 dark:bg-gold-900/40 dark:text-gold-200">
              Featured
            </span>
            <h2 className="font-heading text-2xl font-semibold">{featured.title}</h2>
            <p className="text-muted-foreground">{featured.excerpt}</p>
            <p className="text-xs text-muted-foreground">
              {featured.published_at && formatDate(featured.published_at)} ·{" "}
              {formatReadingTime(featured.reading_time)}
            </p>
          </div>
        </Link>
      )}

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/articles"
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium",
            !params.category
              ? "border-forest-600 bg-forest-600 text-white"
              : "border-border bg-card hover:border-forest-400"
          )}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/articles/${cat.slug}`}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-forest-400"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <Suspense fallback={<ArticlesGridSkeleton />}>
        <ArticlesResults page={Number(params.page ?? "1") || 1} search={params.q} categories={categories} />
      </Suspense>
    </div>
  );
}

async function ArticlesResults({
  page,
  search,
  categories,
}: {
  page: number;
  search?: string;
  categories: Awaited<ReturnType<typeof getArticleCategories>>;
}) {
  const pageSize = 9;
  const { articles, total } = await getPublishedArticles({ search, page, pageSize });

  if (articles.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
        No articles found.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            category={attachCategory(article, categories).category}
          />
        ))}
      </div>
      <ShopPagination page={page} pageSize={pageSize} total={total} />
    </div>
  );
}

function ArticlesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="aspect-[16/10] w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
