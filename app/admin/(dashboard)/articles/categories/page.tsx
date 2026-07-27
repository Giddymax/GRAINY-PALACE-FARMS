import { requireStaff } from "@/lib/auth/require-role";
import { getArticleCategories } from "@/lib/data/articles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { CategoryDeleteButton } from "@/components/admin/category-delete-button";

export const metadata = { title: "Article Categories — Admin" };

export default async function AdminArticleCategoriesPage() {
  await requireStaff();
  const categories = await getArticleCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">Article categories</h1>
        <CategoryFormDialog />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Sort</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                <TableCell>{cat.sort_order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <CategoryFormDialog category={cat} />
                    <CategoryDeleteButton id={cat.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
