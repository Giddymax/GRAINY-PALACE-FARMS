import { redirect } from "next/navigation";
import { confirmPaystackOrder } from "@/lib/payments/confirm-order";

export const metadata = { title: "Confirming payment" };

export default async function VerifyPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  if (!reference) {
    redirect("/checkout");
  }

  const result = await confirmPaystackOrder(reference);

  if (result.success) {
    redirect(`/checkout/success?ref=${reference}`);
  }

  redirect(`/checkout/failed?ref=${reference}`);
}
