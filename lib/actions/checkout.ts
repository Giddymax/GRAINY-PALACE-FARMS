"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkoutSchema, cartItemsSchema } from "@/lib/validations/checkout";
import { generateOrderReference } from "@/lib/orders/reference";
import { getDeliveryFees, type DeliveryZone } from "@/lib/data/site-content";
import { initializeTransaction } from "@/lib/payments/paystack";
import { siteConfig } from "@/lib/site-config";

export type CheckoutActionState = { error?: string } | null;

export async function createOrderAction(
  _prevState: CheckoutActionState,
  formData: FormData
): Promise<CheckoutActionState> {
  const parsed = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail"),
    deliveryZone: formData.get("deliveryZone"),
    deliveryAddress: formData.get("deliveryAddress"),
    paymentMethod: formData.get("paymentMethod"),
    notes: formData.get("notes"),
    cartItemsJson: formData.get("cartItemsJson"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  let cartLines: { productId: string; quantity: number }[];
  try {
    const rawItems = JSON.parse(parsed.data.cartItemsJson);
    cartLines = cartItemsSchema.parse(rawItems);
  } catch {
    return { error: "Your cart looks invalid — please refresh and try again." };
  }

  const supabase = await createClient();

  // Never trust client-supplied prices: re-derive from the DB.
  const productIds = cartLines.map((l) => l.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds);

  if (productsError || !products || products.length === 0) {
    return { error: "We couldn't verify your cart items. Please refresh and try again." };
  }

  const orderItems = cartLines
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product || !product.is_available) return null;
      return {
        product_id: product.id,
        product_name: product.name,
        unit: product.unit,
        unit_price: product.price,
        quantity: line.quantity,
        line_total: Math.round(product.price * line.quantity * 100) / 100,
      };
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);

  if (orderItems.length === 0) {
    return { error: "None of the items in your cart are currently available." };
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);
  const deliveryFees = await getDeliveryFees();
  const zone = parsed.data.deliveryZone as DeliveryZone;
  const deliveryFee = deliveryFees[zone];
  const total = Math.round((subtotal + deliveryFee) * 100) / 100;
  const reference = generateOrderReference();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      reference,
      customer_name: parsed.data.customerName,
      customer_phone: parsed.data.customerPhone,
      customer_email: parsed.data.customerEmail || null,
      delivery_zone: zone,
      delivery_address: zone === "pickup" ? null : parsed.data.deliveryAddress || null,
      delivery_fee: deliveryFee,
      payment_method: parsed.data.paymentMethod,
      payment_status: "pending",
      status: "new",
      subtotal,
      total,
      notes: parsed.data.notes || null,
    })
    .select("*")
    .single();

  if (orderError || !order) {
    return { error: "We couldn't place your order. Please try again." };
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    return { error: "We couldn't save your order items. Please try again." };
  }

  if (parsed.data.paymentMethod === "paystack") {
    let authorizationUrl: string | null = null;
    try {
      const result = await initializeTransaction({
        email: parsed.data.customerEmail || "orders@grainypalacefarm.com",
        amountGHS: total,
        reference,
        callbackUrl: `${siteConfig.url}/checkout/verify?reference=${reference}`,
        metadata: { order_id: order.id },
      });
      authorizationUrl = result.authorizationUrl;
    } catch {
      return {
        error:
          "We couldn't start your card/Mobile Money payment. Please try Cash on Delivery or Bank Transfer instead.",
      };
    }
    // redirect() throws internally — must happen outside the try/catch above.
    redirect(authorizationUrl);
  }

  redirect(`/checkout/success?ref=${reference}`);
}
