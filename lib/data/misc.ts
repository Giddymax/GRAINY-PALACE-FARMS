import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function getCertifications() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getGalleryItems(category?: string) {
  const supabase = await createClient();
  let query = supabase.from("gallery_items").select("*").order("sort_order", { ascending: true });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getPublishedEvents() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("event_date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getOpenJobs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_openings")
    .select("*")
    .eq("is_open", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getHeroSlides() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Known page-hero slots. Order here drives the admin list. */
export const PAGE_HERO_SLUGS = [
  { slug: "home-hero-bg", label: "Homepage Hero (background)" },
  { slug: "shop", label: "Shop" },
  { slug: "livestock", label: "Livestock" },
  { slug: "fish", label: "Fish & Aquaculture" },
  { slug: "seedlings", label: "Seedlings" },
  { slug: "lab-services", label: "Lab Services" },
  { slug: "wholesale", label: "Wholesale" },
  { slug: "partners", label: "Partners" },
  { slug: "articles", label: "Knowledge Hub" },
  { slug: "news", label: "News & Events" },
  { slug: "about", label: "About" },
  { slug: "sustainability", label: "Sustainability" },
  { slug: "careers", label: "Careers" },
  { slug: "traceability", label: "Traceability" },
  { slug: "contact", label: "Contact" },
] as const;

export async function getPageHero(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_heroes")
    .select("*")
    .eq("page_slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Staff-only: every page_heroes row, for the admin list (includes empty slots). */
export async function getAllPageHeroes() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("page_heroes").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function lookupTraceabilityBatch(code: string) {
  const supabase = await createClient();
  const { data: batch, error } = await supabase
    .from("product_batches")
    .select("*")
    .eq("batch_code", code)
    .maybeSingle();
  if (error) throw error;
  if (!batch) return null;

  if (!batch.product_id) return { ...batch, product: null };

  const { data: product } = await supabase
    .from("products")
    .select("name, slug, category, traceability_note")
    .eq("id", batch.product_id)
    .maybeSingle();

  return { ...batch, product: product ?? null };
}

export async function lookupLabSample(reference: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("lookup_lab_sample", { p_reference: reference });
  if (error) throw error;
  return data?.[0] ?? null;
}
