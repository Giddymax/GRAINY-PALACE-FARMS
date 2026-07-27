import type { Metadata } from "next";
import { getDeliveryFees } from "@/lib/data/site-content";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const deliveryFees = await getDeliveryFees();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-semibold">Checkout</h1>
      <CheckoutForm deliveryFees={deliveryFees} />
    </div>
  );
}
