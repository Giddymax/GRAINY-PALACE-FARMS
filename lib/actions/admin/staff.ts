"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-role";
import type { ProfileRole } from "@/lib/supabase/database.types";

export type InviteStaffResult = { error?: string } | null;

/** Invites a new staff/admin account by email via the Supabase Auth Admin
 *  API (never the client-side anon key), then sets their role once the
 *  signup trigger has created their profile row. */
export async function inviteStaffAction(
  _prevState: InviteStaffResult,
  formData: FormData
): Promise<InviteStaffResult> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const role = formData.get("role") as ProfileRole;

  if (!email || !fullName) return { error: "Name and email are required." };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Could not send the invite." };
  }

  await admin.from("profiles").update({ role }).eq("id", data.user.id);

  revalidatePath("/admin/staff");
  return null;
}

export async function updateStaffRoleAction(profileId: string, role: ProfileRole) {
  const currentAdmin = await requireAdmin();
  if (profileId === currentAdmin.id) {
    throw new Error("You cannot change your own role.");
  }
  const admin = createAdminClient();
  await admin.from("profiles").update({ role }).eq("id", profileId);
  revalidatePath("/admin/staff");
}

export async function setProfileActiveAction(profileId: string, isActive: boolean) {
  const currentAdmin = await requireAdmin();
  if (profileId === currentAdmin.id) {
    throw new Error("You cannot deactivate your own account.");
  }
  const admin = createAdminClient();
  await admin.from("profiles").update({ is_active: isActive }).eq("id", profileId);
  revalidatePath("/admin/staff");
}
