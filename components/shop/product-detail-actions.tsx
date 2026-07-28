"use client";

import * as React from "react";
import { Check, Minus, Plus, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/context";
import { formatGHS } from "@/lib/format";
import { buildWhatsAppLink, buildProductOrderMessage } from "@/lib/whatsapp";
import { useAddedFeedback } from "@/lib/hooks/use-added-feedback";
import { toast } from "sonner";
import type { Product } from "@/lib/data/products";

export function ProductDetailActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [justAdded, pulseAdded] = useAddedFeedback();

  const whatsappHref = buildWhatsAppLink(
    buildProductOrderMessage({
      name: product.name,
      quantity,
      unit: product.unit,
      price: product.price,
    })
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Quantity ({product.unit})</span>
        <div className="flex items-center rounded-md border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-10 items-center justify-center hover:bg-muted"
          >
            <Minus className="size-4" />
          </button>
          <span className="min-w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex size-10 items-center justify-center hover:bg-muted"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <p className="text-lg font-semibold">
        Total: {formatGHS(product.price * quantity)}
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          disabled={!product.is_available}
          onClick={() => {
            addItem(
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                imageUrl: product.image_url,
                price: product.price,
                unit: product.unit,
              },
              quantity
            );
            pulseAdded();
            toast.success(`${quantity} × ${product.name} added to cart`);
          }}
        >
          {justAdded ? (
            <>
              <Check className="mr-1 size-4" /> Added to cart
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1 size-4" />
              {product.is_available ? "Add to cart" : "Coming soon"}
            </>
          )}
        </Button>
        <Button size="lg" variant="outline" className="flex-1 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10" asChild>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-1 size-4" /> Order on WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
