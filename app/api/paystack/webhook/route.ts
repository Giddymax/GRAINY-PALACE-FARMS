import { NextResponse, type NextRequest } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/paystack";
import { confirmPaystackOrder } from "@/lib/payments/confirm-order";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference: string | undefined = event.data?.reference;
    if (reference) {
      await confirmPaystackOrder(reference);
    }
  }

  // Always 200 so Paystack doesn't retry on events we intentionally ignore.
  return NextResponse.json({ received: true });
}
