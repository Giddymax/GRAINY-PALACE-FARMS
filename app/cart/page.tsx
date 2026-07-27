"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/context";
import { formatGHS } from "@/lib/format";
import { buildWhatsAppLink, buildCartOrderMessage } from "@/lib/whatsapp";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingCart className="size-12 text-muted-foreground" />
        <h1 className="font-heading text-2xl font-semibold">Your cart is empty</h1>
        <p className="text-muted-foreground">
          Browse our shop to add certified farm produce, livestock, fish and more.
        </p>
        <Button asChild size="lg">
          <Link href="/shop">Shop now</Link>
        </Button>
      </div>
    );
  }

  const whatsappHref = buildWhatsAppLink(
    buildCartOrderMessage(
      items.map((i) => ({ name: i.name, quantity: i.quantity, unit: i.unit, price: i.price }))
    )
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-semibold">Your Cart</h1>

      <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 p-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/product/${item.slug}`} className="font-medium hover:underline">
                  {item.name}
                </Link>
                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeItem(item.productId)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatGHS(item.price)} / {item.unit}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-muted"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="min-w-7 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.name}`}
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-muted"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <p className="font-medium">{formatGHS(item.price * item.quantity)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col items-end gap-4">
        <div className="flex w-full max-w-xs items-center justify-between text-lg font-semibold sm:w-auto">
          <span>Subtotal</span>
          <span className="ml-8">{formatGHS(subtotal)}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Delivery fees calculated at checkout.
        </p>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button asChild variant="outline" size="lg" className="border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-1 size-4" /> Order on WhatsApp
            </a>
          </Button>
          <Button asChild size="lg">
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
