"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/require-role";
import type { CertificationStatus } from "@/lib/supabase/database.types";

export async function saveCertificationAction(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();

  const id = formData.get("id") as string | null;
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    issuing_body: (formData.get("issuingBody") as string) || null,
    status: formData.get("status") as CertificationStatus,
    badge_image: (formData.get("badgeImage") as string) || null,
    sort_order: Number(formData.get("sortOrder") ?? 0),
  };

  if (id) {
    await supabase.from("certifications").update(payload).eq("id", id);
  } else {
    await supabase.from("certifications").insert(payload);
  }

  revalidatePath("/about");
  revalidatePath("/admin/certifications");
}

export async function deleteCertificationAction(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("certifications").delete().eq("id", id);
  revalidatePath("/about");
  revalidatePath("/admin/certifications");
}
