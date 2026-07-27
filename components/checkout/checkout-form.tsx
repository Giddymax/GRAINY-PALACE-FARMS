"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, Store, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/lib/cart/context";
import { formatGHS } from "@/lib/format";
import { createOrderAction, type CheckoutActionState } from "@/lib/actions/checkout";
import type { DeliveryZone } from "@/lib/data/site-content";

export function CheckoutForm({
  deliveryFees,
}: {
  deliveryFees: Record<DeliveryZone, number>;
}) {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const [zone, setZone] = React.useState<DeliveryZone>("accra");
  const [paymentMethod, setPaymentMethod] = React.useState("paystack");
  const [state, formAction, pending] = useActionState<CheckoutActionState, FormData>(
    createOrderAction,
    null
  );

  React.useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  const deliveryFee = deliveryFees[zone];
  const total = subtotal + deliveryFee;
  const cartItemsJson = JSON.stringify(
    items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
  );

  if (items.length === 0) return null;

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <input type="hidden" name="cartItemsJson" value={cartItemsJson} />

      <div className="flex flex-col gap-6">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-heading text-lg font-semibold">Your details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="customerName">Full name</Label>
              <Input id="customerName" name="customerName" required autoComplete="name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="customerPhone">Phone number</Label>
              <Input id="customerPhone" name="customerPhone" required autoComplete="tel" placeholder="024 xxx xxxx" />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="customerEmail">Email (required for card/MoMo payment)</Label>
              <Input id="customerEmail" name="customerEmail" type="email" autoComplete="email" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-heading text-lg font-semibold">Delivery</h2>
          <RadioGroup
            name="deliveryZone"
            value={zone}
            onValueChange={(v) => setZone(v as DeliveryZone)}
            className="flex flex-col gap-3"
          >
            <DeliveryOption
              value="accra"
              icon={<Truck className="size-4" />}
              label="Accra intra-city delivery"
              fee={deliveryFees.accra}
            />
            <DeliveryOption
              value="nationwide"
              icon={<Truck className="size-4" />}
              label="Nationwide courier"
              fee={deliveryFees.nationwide}
            />
            <DeliveryOption
              value="pickup"
              icon={<Store className="size-4" />}
              label="Farm-gate pickup"
              fee={0}
            />
          </RadioGroup>
          {zone !== "pickup" && (
            <div className="mt-4 flex flex-col gap-1.5">
              <Label htmlFor="deliveryAddress">Delivery address</Label>
              <Textarea id="deliveryAddress" name="deliveryAddress" required rows={2} />
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-heading text-lg font-semibold">Payment method</h2>
          <RadioGroup
            name="paymentMethod"
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="flex flex-col gap-3"
          >
            <PaymentOption
              value="paystack"
              icon={<CreditCard className="size-4" />}
              label="Card / Mobile Money (MTN, Telecel, AirtelTigo)"
              description="Pay securely via Paystack"
            />
            <PaymentOption
              value="cash"
              icon={<Banknote className="size-4" />}
              label="Cash on delivery"
              description="Pay the rider when your order arrives"
            />
            <PaymentOption
              value="bank_transfer"
              icon={<Banknote className="size-4" />}
              label="Bank transfer"
              description="We'll send account details after you place the order"
            />
          </RadioGroup>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <Label htmlFor="notes">Order notes (optional)</Label>
          <Textarea id="notes" name="notes" rows={2} className="mt-1.5" placeholder="e.g. call on arrival, gate code, preferred delivery time" />
        </section>
      </div>

      <div className="flex h-fit flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-lg font-semibold">Order summary</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-2">
              <span className="text-muted-foreground">
                {item.quantity} × {item.name}
              </span>
              <span>{formatGHS(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatGHS(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{formatGHS(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatGHS(total)}</span>
          </div>
        </div>
        {state?.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Placing order…" : `Place order — ${formatGHS(total)}`}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By ordering you agree to be contacted about delivery. No account required.
        </p>
        <Link href="/cart" className="text-center text-xs text-muted-foreground hover:underline">
          Back to cart
        </Link>
      </div>
    </form>
  );
}

function DeliveryOption({
  value,
  icon,
  label,
  fee,
}: {
  value: string;
  icon: React.ReactNode;
  label: string;
  fee: number;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border p-3 has-[[data-state=checked]]:border-forest-500 has-[[data-state=checked]]:bg-forest-50 dark:has-[[data-state=checked]]:bg-forest-950/30">
      <span className="flex items-center gap-2 text-sm font-medium">
        <RadioGroupItem value={value} /> {icon} {label}
      </span>
      <span className="text-sm text-muted-foreground">
        {fee === 0 ? "Free" : formatGHS(fee)}
      </span>
    </label>
  );
}

function PaymentOption({
  value,
  icon,
  label,
  description,
}: {
  value: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 has-[[data-state=checked]]:border-forest-500 has-[[data-state=checked]]:bg-forest-50 dark:has-[[data-state=checked]]:bg-forest-950/30">
      <RadioGroupItem value={value} className="mt-0.5" />
      <span className="flex flex-col gap-0.5">
        <span className="flex items-center gap-2 text-sm font-medium">
          {icon} {label}
        </span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </span>
    </label>
  );
}
