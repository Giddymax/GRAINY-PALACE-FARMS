"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/require-role";

/** formData contains fields named "section:key" for every editable value. */
export async function saveSiteContentAction(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();

  const updates: { section: string; key: string; value: string }[] = [];
  for (const [name, value] of formData.entries()) {
    const [section, key] = name.split(":");
    if (section && key) updates.push({ section, key, value: String(value) });
  }

  await Promise.all(
    updates.map((u) =>
      supabase
        .from("site_content")
        .upsert(u, { onConflict: "section,key" })
    )
  );

  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
}

export async function saveHeroSlideAction(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();

  const id = formData.get("id") as string | null;
  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    subtitle: (formData.get("subtitle") as string) || null,
    image_url: (formData.get("imageUrl") as string) || null,
    cta_label: (formData.get("ctaLabel") as string) || null,
    cta_href: (formData.get("ctaHref") as string) || null,
    sort_order: Number(formData.get("sortOrder") ?? 0),
    is_active: formData.get("isActive") === "on",
  };

  if (id) {
    await supabase.from("hero_slides").update(payload).eq("id", id);
  } else {
    await supabase.from("hero_slides").insert(payload);
  }

  revalidatePath("/");
  revalidatePath("/admin/content");
}

export async function deleteHeroSlideAction(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("hero_slides").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/content");
}

export async function saveGalleryItemAction(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();

  const payload = {
    title: (formData.get("title") as string) || null,
    image_url: String(formData.get("imageUrl") ?? ""),
    category: (formData.get("category") as string) || null,
    sort_order: Number(formData.get("sortOrder") ?? 0),
  };

  if (!payload.image_url) return;
  await supabase.from("gallery_items").insert(payload);

  revalidatePath("/about");
  revalidatePath("/admin/content");
}

export async function deleteGalleryItemAction(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("gallery_items").delete().eq("id", id);
  revalidatePath("/about");
  revalidatePath("/admin/content");
}

/** "home-hero-bg" isn't a route — it's the homepage hero's background slot. */
function pageHeroRoute(pageSlug: string) {
  return pageSlug === "home-hero-bg" ? "/" : `/${pageSlug}`;
}

export async function savePageHeroAction(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();

  const pageSlug = String(formData.get("pageSlug") ?? "").trim();
  if (!pageSlug) return;

  const payload = {
    page_slug: pageSlug,
    title: String(formData.get("title") ?? "").trim() || pageSlug,
    subtitle: (formData.get("subtitle") as string) || null,
    image_url: (formData.get("imageUrl") as string) || null,
  };

  await supabase.from("page_heroes").upsert(payload, { onConflict: "page_slug" });

  revalidatePath(pageHeroRoute(pageSlug));
  revalidatePath("/admin/content");
}

export async function clearPageHeroImageAction(pageSlug: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("page_heroes").update({ image_url: null }).eq("page_slug", pageSlug);
  revalidatePath(pageHeroRoute(pageSlug));
  revalidatePath("/admin/content");
}
