import { z } from "zod";

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Name is required."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens."),
  category: z.string().min(1, "Choose a category."),
  subcategory: z.string().min(1, "Choose a subcategory."),
  description: z.string().trim().min(1, "Add a description."),
  price: z.coerce.number().min(0, "Price must be 0 or more."),
  unit: z.string().min(1, "Choose a unit."),
  tags: z.string().optional().or(z.literal("")),
  traceabilityNote: z.string().optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
  isAvailable: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});
