import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/lib/actions/auth";
import { PushManager } from "@/components/pwa/push-manager";
import { formatGHS, formatDate } from "@/lib/format";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const profile = await getCurrentUser();
  if (!profile) redirect("/login?next=/account");

  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, reference, status, total, created_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold">
        Hello, {profile.full_name ?? profile.email}
      </h1>
      <p className="mt-1 text-muted-foreground">
        Track your orders and get notified the moment their status changes.
      </p>

      <div className="mt-4">
        <PushManager label="Notify me about my orders" />
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold">Recent orders</h2>
        {orders && orders.length > 0 ? (
          <ul className="mt-3 flex flex-col divide-y divide-border rounded-xl border border-border">
            {orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-mono text-sm font-medium">{order.reference}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{formatGHS(order.total)}</span>
                  <Badge variant="secondary" className="capitalize">
                    {order.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No orders yet — orders placed while signed in will show up here.
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/shop">Continue shopping</Link>
        </Button>
        {profile.role === "partner" && (
          <Button asChild variant="outline">
            <Link href="/partners/dashboard">Partner dashboard</Link>
          </Button>
        )}
        <form action={signOutAction}>
          <Button type="submit" variant="ghost">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
