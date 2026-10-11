"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/require-role";
import { sendPushToUser } from "@/lib/push/send";
import type { OrderStatus } from "@/lib/supabase/database.types";

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  await requireStaff();
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("reference, user_id")
    .maybeSingle();
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");

  if (order?.user_id) {
    await sendPushToUser(order.user_id, {
      title: "Order update",
      body: `Your order ${order.reference} is now ${status}.`,
      url: "/account",
    }).catch((err) => console.error("Order push notification failed:", err));
  }
}
