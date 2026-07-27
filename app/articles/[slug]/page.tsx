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
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/articles" className="hover:underline">Knowledge Hub</Link>
        {currentCategory && (
          <>
            <ChevronRight className="size-3.5" />
            <Link href={`/articles/${currentCategory.slug}`} className="hover:underline">
              {currentCategory.name}
            </Link>
          </>
        )}
      </nav>

      {currentCategory && (
        <span className="mb-3 inline-block rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold text-forest-800 dark:bg-forest-900/50 dark:text-forest-200">
          {currentCategory.name}
        </span>
      )}
      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">{article.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span>By {article.author_name}</span>
        <span aria-hidden>·</span>
        <span>{article.published_at && formatDate(article.published_at)}</span>
        <span aria-hidden>·</span>
        <span>{formatReadingTime(article.reading_time)}</span>
      </div>

      {article.cover_image && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
          <Image src={article.cover_image} alt={article.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="mt-8">
        <ArticleBody body={article.body} />
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
        <ShareButtons title={article.title} url={`${siteConfig.url}/articles/${article.slug}`} />
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-heading text-xl font-semibold">Related articles</h2>
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
