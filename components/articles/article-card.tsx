import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatReadingTime } from "@/lib/format";
import type { Article, ArticleCategory } from "@/lib/data/articles";

export function ArticleCard({
  article,
  category,
}: {
  article: Article;
  category?: ArticleCategory | null;
}) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-forest-100 to-gold-100 dark:from-forest-900 dark:to-forest-800">
            <BookOpen className="size-8 text-forest-600 dark:text-forest-300" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {category && <Badge variant="secondary" className="w-fit">{category.name}</Badge>}
        <h3 className="font-heading font-semibold leading-snug group-hover:underline">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        <p className="mt-auto pt-2 text-xs text-muted-foreground">
          {article.published_at && formatDate(article.published_at)} ·{" "}
          {formatReadingTime(article.reading_time)}
        </p>
      </div>
    </Link>
  );
}
