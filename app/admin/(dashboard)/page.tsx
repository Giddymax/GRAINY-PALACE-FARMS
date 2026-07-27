import Link from "next/link";
import { DollarSign, ShoppingBag, Inbox, AlertTriangle } from "lucide-react";
import { requireStaff } from "@/lib/auth/require-role";
import { getDashboardStats } from "@/lib/data/admin-dashboard";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { Badge } from "@/components/ui/badge";
import { formatGHS, formatDate } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const profile = await requireStaff();
  const stats = await getDashboardStats();

  const cards = [
    { label: "Revenue (paid orders)", value: formatGHS(stats.revenue), icon: DollarSign },
    { label: "Total orders", value: String(stats.orderCount), icon: ShoppingBag },
    { label: "Pending quotes", value: String(stats.pendingQuotes), icon: Inbox, href: "/admin/enquiries" },
    { label: "Low-stock items", value: String(stats.lowStockCount), icon: AlertTriangle, href: "/admin/inventory", warn: stats.lowStockCount > 0 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-semibold">
        Welcome back, {profile.full_name ?? profile.email}
      </h1>
      <p className="mt-1 text-muted-foreground">Here&apos;s how the farm is doing.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const CardInner = (
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className={`mt-1 text-xl font-semibold ${card.warn ? "text-destructive" : ""}`}>
                  {card.value}
                </p>
              </div>
              <card.icon className={`size-6 ${card.warn ? "text-destructive" : "text-forest-600"}`} />
            </div>
          );
          return card.href ? (
            <Link key={card.label} href={card.href}>
              {CardInner}
            </Link>
          ) : (
            <div key={card.label}>{CardInner}</div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 font-heading text-lg font-semibold">Revenue — last 7 days</h2>
        <RevenueChart data={stats.revenueByDay} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-forest-700 hover:underline dark:text-forest-300">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                      {order.reference}
                    </Link>
                  </TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{formatGHS(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                </TableRow>
              ))}
              {stats.recentOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
