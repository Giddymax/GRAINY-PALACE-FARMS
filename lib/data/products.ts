import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Product = Database["public"]["Tables"]["products"]["Row"];

export type ProductFilters = {
  category?: string;
  subcategory?: string;
  search?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "name";
  page?: number;
  pageSize?: number;
};

export async function getProducts(filters: ProductFilters = {}) {
  const supabase = await createClient();
  const {
    category,
    subcategory,
    search,
    tags,
    minPrice,
    maxPrice,
    availableOnly,
    sort = "newest",
    page = 1,
    pageSize = 24,
  } = filters;

  let query = supabase.from("products").select("*", { count: "exact" });

  if (category) query = query.eq("category", category);
  if (subcategory) query = query.eq("subcategory", subcategory);
  if (search) query = query.ilike("name", `%${search}%`);
  if (tags && tags.length > 0) query = query.overlaps("tags", tags);
  if (typeof minPrice === "number") query = query.gte("price", minPrice);
  if (typeof maxPrice === "number") query = query.lte("price", maxPrice);
  if (availableOnly) query = query.eq("is_available", true);

  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw error;

  return { products: data ?? [], total: count ?? 0, page, pageSize };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .eq("is_available", true)
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedProducts(limit = 8) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getPriceRange() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("price")
    .order("price", { ascending: true });
  if (error) throw error;
  if (!data || data.length === 0) return { min: 0, max: 1000 };
  return { min: data[0].price, max: data[data.length - 1].price };
}
