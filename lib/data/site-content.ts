import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Reads one site_content value, falling back to `fallback` if missing (no
 *  live Supabase project connected yet, or the row hasn't been seeded). */
export async function getSiteContentValue(
  section: string,
  key: string,
  fallback: string
): Promise<string> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("section", section)
      .eq("key", key)
      .maybeSingle();
    return data?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getSiteContentSection(
  section: string
): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_content")
      .select("key, value")
      .eq("section", section);
    return Object.fromEntries((data ?? []).map((row) => [row.key, row.value ?? ""]));
  } catch {
    return {};
  }
}

export type DeliveryZone = "accra" | "nationwide" | "pickup";

export async function getDeliveryFees() {
  const [accra, nationwide] = await Promise.all([
    getSiteContentValue("delivery", "accra_flat_fee", "25"),
    getSiteContentValue("delivery", "nationwide_flat_fee", "60"),
  ]);
  return {
    accra: Number(accra) || 0,
    nationwide: Number(nationwide) || 0,
    pickup: 0,
  } satisfies Record<DeliveryZone, number>;
}
