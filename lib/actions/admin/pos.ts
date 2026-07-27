"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/require-role";
import { generateOrderReference } from "@/lib/orders/reference";

const saleItemSchema = z.object({
  inventoryItemId: z.string().uuid(),
  name: z.string().min(1),
  unit: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().positive(),
});

const saleSchema = z.object({
  items: z.array(saleItemSchema).min(1),
  customerName: z.string().trim().optional(),
});

export type PosSaleResult =
  | { success: true; reference: string; total: number }
  | { success: false; error: string };

export async function createPosSaleAction(
  input: z.infer<typeof saleSchema>
): Promise<PosSaleResult> {
  await requireStaff();

  const parsed = saleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid sale data." };
  }

  const supabase = await createClient();
  const subtotal = parsed.data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const reference = generateOrderReference();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      reference,
      customer_name: parsed.data.customerName || "Walk-in customer",
      customer_phone: "N/A",
      delivery_zone: "pickup",
      delivery_fee: 0,
      payment_method: "cash",
      payment_status: "paid",
      status: "delivered",
      subtotal,
      total: subtotal,
      notes: "Point of Sale in-person transaction.",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { success: false, error: "Could not record the sale." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    parsed.data.items.map((item) => ({
      order_id: order.id,
      product_id: null,
      product_name: item.name,
      unit: item.unit,
      unit_price: item.price,
      quantity: item.quantity,
      line_total: Math.round(item.price * item.quantity * 100) / 100,
    }))
  );

  if (itemsError) {
    return { success: false, error: "Could not save sale line items." };
  }

  for (const item of parsed.data.items) {
    const { data: current } = await supabase
      .from("inventory_items")
      .select("stock_quantity")
      .eq("id", item.inventoryItemId)
      .maybeSingle();
    if (current) {
      await supabase
        .from("inventory_items")
        .update({ stock_quantity: Math.max(0, current.stock_quantity - item.quantity) })
        .eq("id", item.inventoryItemId);
    }
  }

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  return { success: true, reference, total: subtotal };
}
