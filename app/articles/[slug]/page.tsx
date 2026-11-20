import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import {
  getArticleCategories,
  getPublishedArticles,
  getArticleBySlug,
  getRelatedArticles,
  incrementArticleViews,
} from "@/lib/data/articles";
import { ArticleCard } from "@/components/articles/article-card";
import { ArticleBody } from "@/components/articles/article-body";
import { ShareButtons } from "@/components/articles/share-buttons";
import { ShopPagination } from "@/components/shop/shop-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatReadingTime } from "@/lib/format";
import { articleJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";

type Params = { slug: string };
type SearchParams = { page?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getArticleCategories();
  const category = categories.find((c) => c.slug === slug);
  if (category) {
    return { title: category.name, description: category.description ?? undefined };
  }

  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  };
}

export default async function ArticleOrCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const categories = await getArticleCategories();
  const category = categories.find((c) => c.slug === slug);

  if (category) {
    const sp = await searchParams;
    return <CategoryView category={category} page={Number(sp.page ?? "1") || 1} categories={categories} />;
  }

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  await incrementArticleViews(article.id, article.views).catch(() => {});

  const currentCategory = categories.find((c) => c.id === article.category_id);
  const related = await getRelatedArticles(article);
  const jsonLd = articleJsonLd({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    coverImage: article.cover_image,
    authorName: article.author_name,
    publishedAt: article.published_at ?? article.created_at,
  });

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/articles" className="hover:underline">Knowledge Hub</Link>
        {currentCategory && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/articles/${currentCategory.slug}`} className="hover:underline">
              {currentCategory.name}
            </Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span className="text-foreground">Article</span>
      </nav>

      <header className="relative isolate flex min-h-[380px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest-900 via-forest-950 to-charcoal text-white shadow-xl shadow-forest-950/15 sm:min-h-[500px]">
        {article.cover_image && (
          <Image
            src={article.cover_image}
            alt=""
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
            priority
          />
        )}
        <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-r from-forest-950/95 via-forest-950/75 to-forest-950/20" />
        <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-t from-forest-950/70 via-transparent to-forest-950/10" />
        <div className="relative z-20 flex w-full flex-col justify-end p-6 sm:p-10 lg:p-14">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
              Knowledge Hub
            </span>
            {currentCategory && (
              <span className="rounded-full bg-gold-400 px-3 py-1 text-xs font-semibold text-forest-950">
                {currentCategory.name}
              </span>
            )}
          </div>
          <h1 className="max-w-4xl font-heading text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
            {article.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/75">
            <span className="font-medium text-white">{article.author_name}</span>
            {article.published_at && <><span aria-hidden="true">·</span><span>{formatDate(article.published_at)}</span></>}
            <span aria-hidden="true">·</span>
            <span>{formatReadingTime(article.reading_time)}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-14">
        <div className="min-w-0 rounded-3xl border border-border/70 bg-card px-5 py-7 shadow-sm sm:px-9 sm:py-10 lg:px-12">
          <ArticleBody body={article.body} className="text-base sm:text-lg" />
        </div>
        <aside className="h-fit rounded-3xl border border-border bg-secondary/45 p-5 sm:p-6 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-700 dark:text-forest-300">Share this story</p>
          <div className="mt-3">
            <ShareButtons title={article.title} url={`${siteConfig.url}/articles/${article.slug}`} />
          </div>
          {article.tags.length > 0 && (
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Topics</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Link href="/articles" className="mt-6 inline-flex border-t border-border pt-5 text-sm font-semibold text-forest-700 hover:underline dark:text-forest-300">
            Explore more articles
          </Link>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl border-t border-border pt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700 dark:text-forest-300">Keep exploring</p>
          <h2 className="mb-5 mt-1 font-heading text-2xl font-semibold">Related articles</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((r) => (
              <ArticleCard key={r.id} article={r} category={currentCategory} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

async function CategoryView({
  category,
  page,
  categories,
}: {
  category: { id: string; name: string; slug: string; description: string | null };
  page: number;
  categories: Awaited<ReturnType<typeof getArticleCategories>>;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link href="/articles" className="hover:underline">Knowledge Hub</Link>
        <ChevronRight className="mx-1 inline size-3.5" />
        <span className="text-foreground">{category.name}</span>
      </nav>
      <h1 className="font-heading text-3xl font-semibold">{category.name}</h1>
      {category.description && (
        <p className="mt-1 text-muted-foreground">{category.description}</p>
      )}
      <div className="mt-8">
        <Suspense fallback={<CategorySkeleton />}>
          <CategoryResults categorySlug={category.slug} page={page} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}

async function CategoryResults({
  categorySlug,
  page,
  categories,
}: {
  categorySlug: string;
  page: number;
  categories: Awaited<ReturnType<typeof getArticleCategories>>;
}) {
  const pageSize = 9;
  const { articles, total } = await getPublishedArticles({ category: categorySlug, page, pageSize });
  const category = categories.find((c) => c.slug === categorySlug) ?? null;

  if (articles.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
        No articles in this category yet.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} category={category} />
        ))}
      </div>
      <ShopPagination page={page} pageSize={pageSize} total={total} />
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[16/10] w-full rounded-xl" />
      ))}
    </div>
  );
}
