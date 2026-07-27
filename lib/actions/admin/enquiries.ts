"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/require-role";
import type {
  QuoteStatus,
  SubscriptionStatus,
  ApplicationStatus,
  JobApplicationStatus,
  LabSampleStatus,
} from "@/lib/supabase/database.types";

export async function updateQuoteStatusAction(id: string, status: QuoteStatus) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("quote_requests").update({ status }).eq("id", id);
  revalidatePath("/admin/enquiries");
}

export async function updateSubscriptionStatusAction(id: string, status: SubscriptionStatus) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("subscriptions").update({ status }).eq("id", id);
  revalidatePath("/admin/enquiries");
}

export async function updateOutgrowerStatusAction(id: string, status: ApplicationStatus) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("outgrower_applications").update({ status }).eq("id", id);
  revalidatePath("/admin/enquiries");
}

export async function updateJobApplicationStatusAction(id: string, status: JobApplicationStatus) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("job_applications").update({ status }).eq("id", id);
  revalidatePath("/admin/enquiries");
}

export async function updateLabSampleStatusAction(id: string, status: LabSampleStatus) {
  await requireStaff();
  const supabase = await createClient();
  const update: { status: LabSampleStatus; completed_at?: string } = { status };
  if (status === "complete") update.completed_at = new Date().toISOString();
  await supabase.from("lab_samples").update(update).eq("id", id);
  revalidatePath("/admin/enquiries");
}

export async function uploadCoaAction(labSampleId: string, file: File) {
  await requireStaff();
  if (!file || file.size === 0) return { error: "No file provided." };

  const supabase = await createClient();
  const path = `coa/${crypto.randomUUID()}.pdf`;
  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || "application/pdf",
  });
  if (uploadError) return { error: "Upload failed." };

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  await supabase
    .from("lab_samples")
    .update({ coa_url: data.publicUrl, status: "complete", completed_at: new Date().toISOString() })
    .eq("id", labSampleId);

  revalidatePath("/admin/enquiries");
  return { url: data.publicUrl };
}

export async function getSignedCvUrl(path: string) {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 300);
  if (error || !data) return null;
  return data.signedUrl;
}
