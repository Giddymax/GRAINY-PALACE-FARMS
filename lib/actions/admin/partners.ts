"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/auth/require-role";
import type { PartnerTier } from "@/lib/supabase/database.types";

export type CreatePartnerResult = { error?: string } | null;

/**
 * Links an existing customer account (found by email) to a new partner
 * record and promotes their role to 'partner'. Uses the service-role
 * client for the role change: requireStaff() is the authorization gate,
 * and profiles.role updates are otherwise blocked for non-admin staff by
 * the protect_profile_privileges() trigger (auth.uid() is null under the
 * service-role connection, which the trigger treats as a trusted backend op).
 */
export async function createPartnerAction(
  _prevState: CreatePartnerResult,
  formData: FormData
): Promise<CreatePartnerResult> {
  await requireStaff();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const businessName = String(formData.get("businessName") ?? "").trim();
  const businessType = (formData.get("businessType") as string) || null;
  const tier = (formData.get("tier") as PartnerTier) || "standard";

  if (!email || !businessName) {
    return { error: "Email and business name are required." };
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!profile) {
    return { error: "No account found for that email. The customer must sign up first." };
  }

  const { error: partnerError } = await admin.from("partners").insert({
    profile_id: profile.id,
    business_name: businessName,
    business_type: businessType,
    tier,
    approved: true,
  });
  if (partnerError) {
    return { error: "Could not create the partner record — an account may already exist for this email." };
  }

  await admin.from("profiles").update({ role: "partner" }).eq("id", profile.id);

  revalidatePath("/admin/partners");
  return null;
}

export async function approvePartnerAction(id: string) {
  const staff = await requireStaff();
  const supabase = await createClient();
  await supabase.from("partners").update({ approved: true, approved_by: staff.id }).eq("id", id);
  revalidatePath("/admin/partners");
}

export async function rejectPartnerAction(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("partners").update({ approved: false }).eq("id", id);
  revalidatePath("/admin/partners");
}

export async function setPartnerTierAction(id: string, tier: PartnerTier) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("partners").update({ tier }).eq("id", id);
  revalidatePath("/admin/partners");
}
