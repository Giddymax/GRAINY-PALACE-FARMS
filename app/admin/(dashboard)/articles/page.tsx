import Link from "next/link";
import { Plus, Eye, Pencil } from "lucide-react";
import { requireStaff } from "@/lib/auth/require-role";
import { getAllArticlesForAdmin, getArticleCategories, attachCategory } from "@/lib/data/articles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { ArticleRowActions } from "@/components/admin/article-row-actions";

export const metadata = { title: "Articles — Admin" };

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string }>;
}) {
  await requireStaff();
  const params = await searchParams;

  const [articles, categories] = await Promise.all([
    getAllArticlesForAdmin({
      search: params.q,
      status: params.status as "draft" | "published" | undefined,
      category: params.category,
    }),
    getArticleCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Knowledge Hub</h1>
          <p className="text-sm text-muted-foreground">{articles.length} articles</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/articles/categories">Manage categories</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/articles/new">
              <Plus className="mr-1 size-4" /> New article
            </Link>
          </Button>
        </div>
      </div>

      <form className="mb-4 flex flex-wrap gap-2" method="get">
        <input
          type="search"
          name="q"
          defaultValue={params.q}
          placeholder="Search title…"
          className="h-9 w-full max-w-xs rounded-md border border-border bg-background px-3 text-sm sm:w-auto"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select
          name="category"
          defaultValue={params.category ?? ""}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <Button type="submit" variant="secondary" size="sm">Filter</Button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => {
              const { category } = attachCategory(article, categories);
              return (
                <TableRow key={article.id}>
                  <TableCell className="max-w-xs truncate font-medium">
                    {article.featured && <Badge variant="secondary" className="mr-2">Featured</Badge>}
                    {article.title}
                  </TableCell>
                  <TableCell>{category?.name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={article.status === "published" ? "default" : "outline"}>
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{article.published_at ? formatDate(article.published_at) : "—"}</TableCell>
                  <TableCell>{article.views}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {article.status === "published" && (
                        <Button asChild size="icon-sm" variant="ghost">
                          <Link href={`/articles/${article.slug}`} target="_blank" aria-label="View">
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                      )}
                      <Button asChild size="icon-sm" variant="ghost">
                        <Link href={`/admin/articles/${article.id}/edit`} aria-label="Edit">
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <ArticleRowActions
                        id={article.id}
                        slug={article.slug}
                        status={article.status}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No articles match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
