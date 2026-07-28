/// <reference types="react/canary" />
"use client";

import Link from "next/link";
import { ViewTransition } from "react";
import { Check, MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/shop/product-image";
import { useCart } from "@/lib/cart/context";
import { formatGHS } from "@/lib/format";
import { buildWhatsAppLink, buildProductOrderMessage } from "@/lib/whatsapp";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { useAddedFeedback } from "@/lib/hooks/use-added-feedback";
import { toast } from "sonner";
import type { Product } from "@/lib/data/products";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const category = getCategoryBySlug(product.category);
  const [justAdded, pulseAdded] = useAddedFeedback();

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.image_url,
        price: product.price,
        unit: product.unit,
      },
      1
    );
    pulseAdded();
    toast.success(`${product.name} added to cart`);
  };

  const whatsappHref = buildWhatsAppLink(
    buildProductOrderMessage({
      name: product.name,
      quantity: 1,
      unit: product.unit,
      price: product.price,
    })
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <ViewTransition name={`product-photo-${product.id}`}>
          <ProductImage
            src={product.image_url}
            alt={product.name}
            categoryIcon={category?.icon}
          />
        </ViewTransition>
        {!product.is_available && (
          <span className="absolute left-2 top-2 rounded-full bg-charcoal/80 px-2 py-0.5 text-xs font-medium text-white">
            Coming soon
          </span>
        )}
        {product.is_available &&
          product.stock_quantity !== null &&
          product.stock_quantity > 0 &&
          product.stock_quantity <= 5 && (
            <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-white">
              Only {product.stock_quantity} left
            </span>
          )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
        <Link href={`/product/${product.slug}`} className="font-heading font-semibold leading-snug hover:underline">
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground">
          {formatGHS(product.price)} <span className="text-xs">/ {product.unit}</span>
        </p>
        <div className="mt-auto flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 transition-colors"
            disabled={!product.is_available}
            onClick={handleAddToCart}
          >
            {justAdded ? (
              <>
                <Check className="size-4" /> Added
              </>
            ) : (
              <>
                <Plus className="size-4" /> Add
              </>
            )}
          </Button>
          <Button size="icon" variant="outline" className="shrink-0" asChild>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Order ${product.name} on WhatsApp`}
            >
              <MessageCircle className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
