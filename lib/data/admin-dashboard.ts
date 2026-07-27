import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();

  const [ordersRes, pendingQuotesRes, inventoryRes, recentOrdersRes] = await Promise.all([
    supabase.from("orders").select("total, payment_status, created_at"),
    supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("inventory_items").select("stock_quantity, low_stock_threshold").eq("is_active", true),
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const orders = ordersRes.data ?? [];
  const revenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const lowStockCount = (inventoryRes.data ?? []).filter(
    (item) => item.stock_quantity <= item.low_stock_threshold
  ).length;

  // Last 7 days revenue for the chart (paid orders only).
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const revenueByDay = days.map((day) => {
    const dayStr = day.toISOString().slice(0, 10);
    const total = orders
      .filter((o) => o.payment_status === "paid" && o.created_at.slice(0, 10) === dayStr)
      .reduce((sum, o) => sum + o.total, 0);
    return {
      date: day.toLocaleDateString("en-GH", { weekday: "short" }),
      total,
    };
  });

  return {
    revenue,
    orderCount: orders.length,
    pendingQuotes: pendingQuotesRes.count ?? 0,
    lowStockCount,
    recentOrders: recentOrdersRes.data ?? [],
    revenueByDay,
  };
}
