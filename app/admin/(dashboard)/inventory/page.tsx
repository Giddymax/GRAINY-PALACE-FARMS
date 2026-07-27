import { requireStaff } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatGHS } from "@/lib/format";
import { InventoryFormDialog } from "@/components/admin/inventory-form-dialog";
import { InventoryRowActions } from "@/components/admin/inventory-row-actions";

export const metadata = { title: "Inventory — Admin" };

export default async function AdminInventoryPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("inventory_items")
    .select("*")
    .order("name", { ascending: true });

  const inventory = items ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Inventory</h1>
          <p className="text-sm text-muted-foreground">{inventory.length} items</p>
        </div>
        <InventoryFormDialog />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              const low = item.stock_quantity <= item.low_stock_threshold;
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell>{formatGHS(item.price)} / {item.unit}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.stock_quantity}
                      {low && <Badge variant="destructive">Low stock</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <InventoryFormDialog item={item} />
                      <InventoryRowActions id={item.id} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {inventory.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No inventory items yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
