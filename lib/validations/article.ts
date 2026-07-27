import { z } from "zod";

export const articleSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3, "Title is required."),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens."),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  excerpt: z.string().trim().min(1, "Add a short excerpt.").max(300),
  body: z.string().trim().min(1, "Article body cannot be empty."),
  authorName: z.string().trim().min(1, "Author name is required."),
  featured: z.boolean().optional(),
  seoTitle: z.string().optional().or(z.literal("")),
  seoDescription: z.string().optional().or(z.literal("")),
  coverImageUrl: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
