import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRole } from "@/lib/supabase/database.types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ?? null;
}

/** Redirects to /admin/login unless the signed-in user is staff or admin. */
export async function requireStaff() {
  const profile = await getCurrentUser();
  if (!profile || !isStaffRole(profile.role) || !profile.is_active) {
    redirect("/admin/login?error=unauthorized");
  }
  return profile;
}

/** Redirects to /admin/login unless the signed-in user is an admin. */
export async function requireAdmin() {
  const profile = await getCurrentUser();
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/admin/login?error=unauthorized");
  }
  return profile;
}

/** Redirects to /login unless the signed-in user is an approved partner. */
export async function requirePartner() {
  const profile = await getCurrentUser();
  if (!profile || profile.role !== "partner" || !profile.is_active) {
    redirect("/login?next=/partners/dashboard");
  }

  const supabase = await createClient();
  const { data: partner } = await supabase
    .from("partners")
    .select("*")
    .eq("profile_id", profile.id)
    .single();

  if (!partner || !partner.approved) {
    redirect("/partners?pending=1");
  }

  return { profile, partner };
}

function isStaffRole(role: ProfileRole) {
  return role === "admin" || role === "staff";
}
