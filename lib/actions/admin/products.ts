"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/require-role";
import { productSchema } from "@/lib/validations/product";
import { broadcastPush } from "@/lib/push/send";

export type ProductActionState = { error?: string } | null;

export async function saveProductAction(
  _prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  await requireStaff();

  const parsed = productSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    subcategory: formData.get("subcategory"),
    description: formData.get("description"),
    price: formData.get("price"),
    unit: formData.get("unit"),
    tags: formData.get("tags") || "",
    traceabilityNote: formData.get("traceabilityNote") || "",
    imageUrl: formData.get("imageUrl") || "",
    isAvailable: formData.get("isAvailable") === "on",
    sortOrder: formData.get("sortOrder") || 0,
    stockQuantity: formData.get("stockQuantity") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  const tags = parsed.data.tags
    ? parsed.data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const payload = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    category: parsed.data.category,
    subcategory: parsed.data.subcategory,
    description: parsed.data.description,
    price: parsed.data.price,
    unit: parsed.data.unit,
    tags,
    traceability_note: parsed.data.traceabilityNote || "Farm-to-fork QR traceable.",
    image_url: parsed.data.imageUrl || null,
    is_available: parsed.data.isAvailable ?? true,
    sort_order: parsed.data.sortOrder ?? 0,
    stock_quantity:
      parsed.data.stockQuantity === "" || parsed.data.stockQuantity === undefined
        ? null
        : parsed.data.stockQuantity,
  };

  if (parsed.data.id) {
    const { error } = await supabase.from("products").update(payload).eq("id", parsed.data.id);
    if (error) return { error: "Could not save the product. The slug may already be in use." };
  } else {
    const { error } = await supabase.from("products").insert(payload);
    if (error) return { error: "Could not create the product. The slug may already be in use." };
  }

  revalidatePath("/shop");
  revalidatePath(`/shop/${parsed.data.category}`);
  revalidatePath(`/product/${parsed.data.slug}`);
  revalidatePath("/admin/catalogue");
  redirect("/admin/catalogue?saved=1");
}

export async function deleteProductAction(id: string, category: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/shop");
  revalidatePath(`/shop/${category}`);
  revalidatePath("/admin/catalogue");
}

export async function toggleProductAvailabilityAction(id: string, isAvailable: boolean) {
  await requireStaff();
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .update({ is_available: isAvailable })
    .eq("id", id)
    .select("name, slug")
    .maybeSingle();
  revalidatePath("/shop");
  revalidatePath("/admin/catalogue");

  if (isAvailable && product) {
    await broadcastPush({
      title: "Back in stock",
      body: `${product.name} is available again.`,
      url: `/product/${product.slug}`,
    }).catch((err) => console.error("Restock push notification failed:", err));
  }
}
