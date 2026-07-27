import "server-only";
import crypto from "node:crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  return key;
}

export type InitializeTransactionResult = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

/**
 * Starts a Paystack transaction (supports Ghana MoMo channels — MTN, Telecel,
 * AirtelTigo — and cards) and returns the hosted checkout URL to redirect to.
 * Amount is in GHS major units; Paystack expects the minor unit (pesewas).
 */
export async function initializeTransaction(params: {
  email: string;
  amountGHS: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<InitializeTransactionResult> {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountGHS * 100),
      currency: "GHS",
      reference: params.reference,
      callback_url: params.callbackUrl,
      channels: ["card", "mobile_money"],
      metadata: params.metadata ?? {},
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? "Failed to initialize Paystack transaction.");
  }

  return {
    authorizationUrl: json.data.authorization_url,
    accessCode: json.data.access_code,
    reference: json.data.reference,
  };
}

export type VerifyTransactionResult = {
  success: boolean;
  reference: string;
  amountGHS: number;
  paidAt: string | null;
  channel: string | null;
};

export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey()}` }, cache: "no-store" }
  );

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message ?? "Failed to verify Paystack transaction.");
  }

  return {
    success: json.data?.status === "success",
    reference: json.data?.reference,
    amountGHS: (json.data?.amount ?? 0) / 100,
    paidAt: json.data?.paid_at ?? null,
    channel: json.data?.channel ?? null,
  };
}

/** Verifies the `x-paystack-signature` header on incoming webhook requests. */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const hash = crypto.createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  return hash === signature;
}
