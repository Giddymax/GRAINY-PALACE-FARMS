import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { categories } from "@/lib/taxonomy";
import { getProducts } from "@/lib/data/products";
import { getPublishedArticles, getArticleCategories } from "@/lib/data/articles";

const staticRoutes = [
  "",
  "/shop",
  "/cart",
  "/checkout",
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
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const [{ products }, { articles }, articleCategories] = await Promise.all([
    getProducts({ pageSize: 1000 }),
    getPublishedArticles({ pageSize: 1000 }),
    getArticleCategories(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${base}/shop/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/product/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const articleCategoryEntries: MetadataRoute.Sitemap = articleCategories.map((cat) => ({
    url: `${base}/articles/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${base}/articles/${article.slug}`,
    lastModified: article.published_at ? new Date(article.published_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...productEntries,
    ...articleCategoryEntries,
    ...articleEntries,
  ];
}
