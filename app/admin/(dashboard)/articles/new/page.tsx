import { requireStaff } from "@/lib/auth/require-role";
import { getArticleCategories } from "@/lib/data/articles";
import { ArticleForm } from "@/components/admin/article-form";

export const metadata = { title: "New Article — Admin" };

export default async function NewArticlePage() {
  await requireStaff();
  const categories = await getArticleCategories();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-heading text-2xl font-semibold">New article</h1>
      <ArticleForm categories={categories} />
    </div>
  );
}
