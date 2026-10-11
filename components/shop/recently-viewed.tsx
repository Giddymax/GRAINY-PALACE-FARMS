"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { getRecentlyViewed, type RecentlyViewedItem } from "@/lib/recently-viewed";
import { formatGHS } from "@/lib/format";

export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed().filter((i) => i.slug !== excludeSlug));
  }, [excludeSlug]);

  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 font-heading text-2xl font-semibold">Recently viewed</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/product/${item.slug}`}
            className="flex w-36 shrink-0 flex-col gap-2 rounded-xl border border-border bg-card p-2 transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill sizes="144px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-forest-100 to-gold-100 dark:from-forest-900 dark:to-forest-800">
                  <Package className="size-6 text-forest-600 dark:text-forest-300" />
                </div>
              )}
            </div>
            <p className="line-clamp-2 text-xs font-medium leading-snug">{item.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatGHS(item.price)} / {item.unit}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
