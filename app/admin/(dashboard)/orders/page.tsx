import Link from "next/link";
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
import { formatGHS, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/supabase/database.types";

export const metadata = { title: "Orders — Admin" };

const statuses = ["new", "confirmed", "dispatched", "delivered", "cancelled"] as const;

function isOrderStatus(value: string): value is OrderStatus {
  return (statuses as readonly string[]).includes(value);
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireStaff();
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status && isOrderStatus(status)) query = query.eq("status", status);
  const { data: orders } = await query;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-heading text-2xl font-semibold">Orders</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium capitalize",
            !status ? "border-forest-600 bg-forest-600 text-white" : "border-border bg-card hover:border-forest-400"
          )}
        >
          All
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium capitalize",
              status === s ? "border-forest-600 bg-forest-600 text-white" : "border-border bg-card hover:border-forest-400"
            )}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(orders ?? []).map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                    {order.reference}
                  </Link>
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{formatGHS(order.total)}</TableCell>
                <TableCell>
                  <Badge variant={order.payment_status === "paid" ? "default" : "outline"} className="capitalize">
                    {order.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">{order.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
              </TableRow>
            ))}
            {(!orders || orders.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
