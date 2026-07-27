"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/require-role";
import { slugify } from "@/lib/validations/article";

export async function saveEventAction(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();

  const id = formData.get("id") as string | null;
  const title = String(formData.get("title") ?? "").trim();
  const payload = {
    title,
    slug: (formData.get("slug") as string) || slugify(title),
    body: String(formData.get("body") ?? ""),
    cover: (formData.get("cover") as string) || null,
    event_date: (formData.get("eventDate") as string) || null,
    location: (formData.get("location") as string) || null,
    is_published: formData.get("isPublished") === "on",
  };

  if (id) {
    await supabase.from("events").update(payload).eq("id", id);
  } else {
    await supabase.from("events").insert(payload);
  }

  revalidatePath("/news");
  revalidatePath("/admin/news");
}

export async function deleteEventAction(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/news");
  revalidatePath("/admin/news");
}
