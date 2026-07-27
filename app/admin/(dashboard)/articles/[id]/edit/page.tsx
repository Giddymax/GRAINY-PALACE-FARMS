import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth/require-role";
import { getArticleById, getArticleCategories } from "@/lib/data/articles";
import { ArticleForm } from "@/components/admin/article-form";

export const metadata = { title: "Edit Article — Admin" };

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const [article, categories] = await Promise.all([
    getArticleById(id),
    getArticleCategories(),
  ]);

  if (!article) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-heading text-2xl font-semibold">Edit article</h1>
      <ArticleForm article={article} categories={categories} />
    </div>
  );
}
