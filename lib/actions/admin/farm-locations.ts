"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/require-role";

function requiredText(formData: FormData, key: string, label: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`${label} is required.`);
  return value;
}

function optionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function optionalWebUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
    return url.toString();
  } catch {
    throw new Error("Enter a valid HTTP or HTTPS map link.");
  }
}

export async function saveFarmLocationAction(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();

  const latitudeText = requiredText(formData, "latitude", "Latitude");
  const longitudeText = requiredText(formData, "longitude", "Longitude");
  const latitude = Number(latitudeText);
  const longitude = Number(longitudeText);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90.");
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180.");
  }

  const sortOrderText = String(formData.get("sortOrder") ?? "0").trim();
  const sortOrder = Number(sortOrderText || "0");
  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error("Display order must be a whole number greater than or equal to 0.");
  }

  const payload = {
    name: requiredText(formData, "name", "Farm name"),
    region: requiredText(formData, "region", "Region"),
    locality: requiredText(formData, "locality", "Town or locality"),
    address: optionalText(formData, "address"),
    description: optionalText(formData, "description"),
    latitude,
    longitude,
    map_url: optionalWebUrl(optionalText(formData, "mapUrl")),
    route_notes: optionalText(formData, "routeNotes"),
    is_published: formData.get("isPublished") === "on",
    sort_order: sortOrder,
  };

  const id = String(formData.get("id") ?? "").trim();
  const result = id
    ? await supabase.from("farm_locations").update(payload).eq("id", id)
    : await supabase.from("farm_locations").insert(payload);

  if (result.error) throw result.error;
  revalidatePath("/farm-locations");
  revalidatePath("/admin/locations");
}

export async function deleteFarmLocationAction(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("farm_locations").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/farm-locations");
  revalidatePath("/admin/locations");
}
