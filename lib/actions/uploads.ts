"use server";

import { createClient } from "@/lib/supabase/server";

export type UploadDocumentResult = { path?: string; error?: string };

/** Public upload (job CVs, lab sample attachments) to the private
 *  `documents` bucket. Anyone may insert (RLS: documents_anon_insert);
 *  only staff can later read it back, via a signed URL. */
export async function uploadDocumentAction(
  folder: string,
  file: File
): Promise<UploadDocumentResult> {
  if (!file || file.size === 0) return { error: "No file provided." };
  if (file.size > 8 * 1024 * 1024) return { error: "File must be under 8MB." };

  const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Please upload a PDF, JPG, PNG or WEBP file." };
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("documents").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return { error: "Upload failed. Please try again." };
  return { path };
}
