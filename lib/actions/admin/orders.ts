"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/require-role";
import type { OrderStatus } from "@/lib/supabase/database.types";

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
}
