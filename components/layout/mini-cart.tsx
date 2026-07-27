"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart/context";
import { formatGHS } from "@/lib/format";

export function MiniCart() {
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
        className="relative size-11 shrink-0"
        onClick={() => setOpen(true)}
      >
        <ShoppingCart className="size-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-gold-500 text-[11px] font-semibold text-charcoal">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Button>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your cart ({itemCount})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingCart className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your cart is empty. Browse the shop to add certified farm produce.
            </p>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/shop">Shop now</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-sm font-medium leading-snug hover:underline"
                          onClick={() => setOpen(false)}
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name} from cart`}
                          onClick={() => removeItem(item.productId)}
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatGHS(item.price)} / {item.unit}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="flex size-7 items-center justify-center rounded-md border border-border hover:bg-muted"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="min-w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="flex size-7 items-center justify-center rounded-md border border-border hover:bg-muted"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <SheetFooter className="gap-2 border-t border-border pt-4">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Subtotal</span>
                <span>{formatGHS(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery fees and payment options are calculated at checkout.
              </p>
              <Button asChild size="lg" onClick={() => setOpen(false)}>
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link href="/cart">View cart</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
