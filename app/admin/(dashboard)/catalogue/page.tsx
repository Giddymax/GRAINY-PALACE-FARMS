import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requireStaff } from "@/lib/auth/require-role";
import { getProducts } from "@/lib/data/products";
import { categories } from "@/lib/taxonomy";
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
import { formatGHS } from "@/lib/format";
import { ProductRowActions } from "@/components/admin/product-row-actions";

export const metadata = { title: "Catalogue — Admin" };

export default async function AdminCataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  await requireStaff();
  const params = await searchParams;
  const { products, total } = await getProducts({
    category: params.category,
    search: params.q,
    pageSize: 200,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Catalogue</h1>
          <p className="text-sm text-muted-foreground">{total} products</p>
        </div>
        <Button asChild>
          <Link href="/admin/catalogue/new">
            <Plus className="mr-1 size-4" /> New product
          </Link>
        </Button>
      </div>

      <form className="mb-4 flex flex-wrap gap-2" method="get">
        <input
          type="search"
          name="q"
          defaultValue={params.q}
          placeholder="Search name…"
          className="h-9 w-full max-w-xs rounded-md border border-border bg-background px-3 text-sm sm:w-auto"
        />
        <select
          name="category"
          defaultValue={params.category ?? ""}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <Button type="submit" variant="secondary" size="sm">Filter</Button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="max-w-xs truncate font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {categories.find((c) => c.slug === product.category)?.name ?? product.category}
                </TableCell>
                <TableCell>{formatGHS(product.price)} / {product.unit}</TableCell>
                <TableCell>
                  <Badge variant={product.is_available ? "default" : "outline"}>
                    {product.is_available ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild size="icon-sm" variant="ghost">
                      <Link href={`/admin/catalogue/${product.id}/edit`} aria-label="Edit">
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <ProductRowActions
                      id={product.id}
                      category={product.category}
                      isAvailable={product.is_available}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No products match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
