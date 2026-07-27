import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction } from "@/lib/payments/paystack";

export type ConfirmOrderResult = {
  success: boolean;
  reference: string;
};

/**
 * Independently verifies a Paystack transaction server-side (never trusts a
 * client-supplied "it worked" signal), then — only on confirmed success —
 * uses the service-role client to mark the matching order as paid. This is
 * the one narrow, justified use of the admin client for guest (unauthenticated)
 * checkouts, since RLS otherwise has no policy letting an anonymous session
 * update an order it doesn't own a session for.
 */
export async function confirmPaystackOrder(reference: string): Promise<ConfirmOrderResult> {
  const verification = await verifyTransaction(reference);

  if (!verification.success) {
    return { success: false, reference };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: "paid", status: "confirmed" })
    .eq("reference", reference)
    .eq("payment_status", "pending");

  if (error) {
    return { success: false, reference };
  }

  return { success: true, reference };
}
