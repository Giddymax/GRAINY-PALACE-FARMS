"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/require-role";
import { inventoryItemSchema } from "@/lib/validations/inventory";

export type InventoryActionState = { error?: string } | null;

export async function saveInventoryItemAction(
  _prevState: InventoryActionState,
  formData: FormData
): Promise<InventoryActionState> {
  await requireStaff();

  const parsed = inventoryItemSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    category: formData.get("category"),
    imageUrl: formData.get("imageUrl") || "",
    price: formData.get("price"),
    costPrice: formData.get("costPrice") || "",
    unit: formData.get("unit"),
    stockQuantity: formData.get("stockQuantity"),
    lowStockThreshold: formData.get("lowStockThreshold"),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  const payload = {
    name: parsed.data.name,
    category: parsed.data.category,
    image_url: parsed.data.imageUrl || null,
    price: parsed.data.price,
    cost_price: parsed.data.costPrice === "" || parsed.data.costPrice === undefined ? null : parsed.data.costPrice,
    unit: parsed.data.unit,
    stock_quantity: parsed.data.stockQuantity,
    low_stock_threshold: parsed.data.lowStockThreshold,
    is_active: parsed.data.isActive ?? true,
  };

  if (parsed.data.id) {
    const { error } = await supabase.from("inventory_items").update(payload).eq("id", parsed.data.id);
    if (error) return { error: "Could not save this item." };
  } else {
    const { error } = await supabase.from("inventory_items").insert(payload);
    if (error) return { error: "Could not create this item." };
  }

  revalidatePath("/admin/inventory");
  redirect("/admin/inventory?saved=1");
}

export async function deleteInventoryItemAction(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("inventory_items").delete().eq("id", id);
  revalidatePath("/admin/inventory");
}

export async function adjustStockAction(id: string, delta: number) {
  await requireStaff();
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("inventory_items")
    .select("stock_quantity")
    .eq("id", id)
    .maybeSingle();
  if (!item) return;
  const next = Math.max(0, item.stock_quantity + delta);
  await supabase.from("inventory_items").update({ stock_quantity: next }).eq("id", id);
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/pos");
}
