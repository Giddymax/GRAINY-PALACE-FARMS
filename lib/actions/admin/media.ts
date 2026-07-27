"use server";

import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/require-role";

export type UploadMediaResult = { url?: string; error?: string };

/** Uploads a staff-supplied file to the public `media` Storage bucket and
 *  returns its public URL. `folder` scopes the path, e.g. "articles", "products". */
export async function uploadMediaAction(
  folder: string,
  file: File
): Promise<UploadMediaResult> {
  await requireStaff();

  if (!file || file.size === 0) return { error: "No file provided." };
  if (file.size > 5 * 1024 * 1024) return { error: "File must be under 5MB." };
  if (!file.type.startsWith("image/")) return { error: "Only image files are supported." };

  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return { error: "Upload failed. Please try again." };

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl };
}
