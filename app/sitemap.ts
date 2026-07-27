import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";
import { categories } from "@/lib/taxonomy";

const staticRoutes = [
  "",
  "/shop",
  "/livestock",
  "/fish",
  "/seedlings",
  "/lab-services",
  "/wholesale",
  "/partners",
  "/articles",
  "/news",
  "/about",
  "/sustainability",
  "/careers",
  "/traceability",
  "/contact",
  "/privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  for (const category of categories) {
    entries.push({
      url: `${siteConfig.url}/shop/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  try {
    const supabase = await createClient();

    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_available", true);
    for (const product of products ?? []) {
      entries.push({
        url: `${siteConfig.url}/product/${product.slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }

    const { data: articles } = await supabase
      .from("articles")
      .select("slug, updated_at")
      .eq("status", "published");
    for (const article of articles ?? []) {
      entries.push({
        url: `${siteConfig.url}/articles/${article.slug}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    const { data: articleCategories } = await supabase.from("article_categories").select("slug");
    for (const cat of articleCategories ?? []) {
      entries.push({
        url: `${siteConfig.url}/articles/${cat.slug}`,
        changeFrequency: "weekly",
        priority: 0.4,
      });
    }
  } catch {
    // No live Supabase project connected in this environment — ship the
    // static routes only rather than failing sitemap generation.
  }

  return entries;
}
