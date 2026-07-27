import { z } from "zod";

export const inventoryItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Name is required."),
  category: z.string().trim().min(1, "Category is required."),
  imageUrl: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be 0 or more."),
  costPrice: z.coerce.number().min(0).optional().or(z.literal("")),
  unit: z.string().min(1, "Unit is required."),
  stockQuantity: z.coerce.number().min(0, "Stock must be 0 or more."),
  lowStockThreshold: z.coerce.number().min(0),
  isActive: z.boolean().optional(),
});
