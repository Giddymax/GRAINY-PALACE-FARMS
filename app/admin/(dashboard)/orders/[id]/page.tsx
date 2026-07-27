import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatGHS, formatDate } from "@/lib/format";
import { OrderStatusActions } from "@/components/admin/order-status-actions";
import { siteConfig } from "@/lib/site-config";

export const metadata = { title: "Order — Admin" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) notFound();

  const { data: items } = await supabase.from("order_items").select("*").eq("order_id", id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div id="receipt" className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-xl font-semibold">{siteConfig.name}</h1>
            <p className="text-xs text-muted-foreground">{siteConfig.contact.address}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm">{order.reference}</p>
            <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 print:hidden">
          <Badge variant="secondary" className="capitalize">{order.status}</Badge>
          <Badge variant={order.payment_status === "paid" ? "default" : "outline"} className="capitalize">
            {order.payment_status}
          </Badge>
          <Badge variant="outline" className="capitalize">{order.payment_method.replace("_", " ")}</Badge>
        </div>

        <div className="mb-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="font-medium">Customer</p>
            <p className="text-muted-foreground">{order.customer_name}</p>
            <p className="text-muted-foreground">{order.customer_phone}</p>
            {order.customer_email && <p className="text-muted-foreground">{order.customer_email}</p>}
          </div>
          <div>
            <p className="font-medium">Delivery</p>
            <p className="text-muted-foreground capitalize">{order.delivery_zone}</p>
            {order.delivery_address && <p className="text-muted-foreground">{order.delivery_address}</p>}
          </div>
        </div>

        {order.notes && (
          <div className="mb-4 text-sm">
            <p className="font-medium">Notes</p>
            <p className="text-muted-foreground">{order.notes}</p>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="pb-2 font-medium">Item</th>
                <th className="pb-2 font-medium">Qty</th>
                <th className="pb-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {(items ?? []).map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="py-2">{item.product_name}</td>
                  <td className="py-2">{item.quantity} {item.unit}</td>
                  <td className="py-2 text-right">{formatGHS(item.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex flex-col items-end gap-1 border-t border-border pt-4 text-sm">
            <div className="flex w-48 justify-between">
              <span>Subtotal</span>
              <span>{formatGHS(order.subtotal)}</span>
            </div>
            <div className="flex w-48 justify-between">
              <span>Delivery</span>
              <span>{formatGHS(order.delivery_fee)}</span>
            </div>
            <div className="flex w-48 justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatGHS(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <OrderStatusActions id={order.id} status={order.status} />
      </div>
    </div>
  );
}
