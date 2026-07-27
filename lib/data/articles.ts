import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type ArticleCategory = Database["public"]["Tables"]["article_categories"]["Row"];

export type ArticleFilters = {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

export async function getArticleCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("article_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// Embedded foreign-table selects (`select("*, article_categories(...)")`) need
// full FK relationship metadata in Database["public"]["Tables"][...]["Relationships"]
// to type correctly; ours are declared empty (see database.types.ts), so we
// resolve the category client-side against getArticleCategories() instead —
// one extra small query, fully type-safe.
export function attachCategory<T extends { category_id: string | null }>(
  article: T,
  categories: ArticleCategory[]
) {
  return { ...article, category: categories.find((c) => c.id === article.category_id) ?? null };
}

export async function getPublishedArticles(filters: ArticleFilters = {}) {
  const supabase = await createClient();
  const { category, search, page = 1, pageSize = 9 } = filters;

  let query = supabase.from("articles").select("*", { count: "exact" }).eq("status", "published");

  if (category) {
    const categories = await getArticleCategories();
    const cat = categories.find((c) => c.slug === category);
    if (cat) query = query.eq("category_id", cat.id);
    else return { articles: [], total: 0, page, pageSize };
  }

  if (search) query = query.ilike("title", `%${search}%`);

  query = query.order("published_at", { ascending: false });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw error;

  return { articles: data ?? [], total: count ?? 0, page, pageSize };
}

export async function getFeaturedArticle() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getRelatedArticles(
  article: { id: string; category_id: string | null },
  limit = 3
) {
  if (!article.category_id) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("category_id", article.category_id)
    .eq("status", "published")
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function incrementArticleViews(id: string, currentViews: number) {
  const supabase = await createClient();
  await supabase.from("articles").update({ views: currentViews + 1 }).eq("id", id);
}

export type AdminArticleFilters = {
  status?: "draft" | "published";
  category?: string;
  search?: string;
};

/** Staff-only: all articles regardless of status (RLS: is_staff() required). */
export async function getAllArticlesForAdmin(filters: AdminArticleFilters = {}) {
  const supabase = await createClient();
  let query = supabase.from("articles").select("*").order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.category) query = query.eq("category_id", filters.category);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getArticleById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}
