import { z } from "zod";

export const deliveryZones = ["accra", "nationwide", "pickup"] as const;
export const paymentMethods = ["paystack", "cash", "bank_transfer"] as const;

export const checkoutSchema = z
  .object({
    customerName: z.string().trim().min(2, "Enter your full name."),
    customerPhone: z
      .string()
      .trim()
      .min(9, "Enter a valid phone number."),
    customerEmail: z.string().trim().email("Enter a valid email address.").optional().or(z.literal("")),
    deliveryZone: z.enum(deliveryZones),
    deliveryAddress: z.string().trim().optional().or(z.literal("")),
    paymentMethod: z.enum(paymentMethods),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
    cartItemsJson: z.string().min(1, "Your cart is empty."),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryZone !== "pickup" && !data.deliveryAddress) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a delivery address.",
        path: ["deliveryAddress"],
      });
    }
    if (data.paymentMethod === "paystack" && !data.customerEmail) {
      ctx.addIssue({
        code: "custom",
        message: "Email is required to pay by card or Mobile Money.",
        path: ["customerEmail"],
      });
    }
  });

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().max(999),
});

export const cartItemsSchema = z.array(cartItemSchema).min(1);
