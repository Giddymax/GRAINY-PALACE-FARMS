"use client";

import { useEffect } from "react";
import { recordProductView, type RecentlyViewedItem } from "@/lib/recently-viewed";

export function RecordProductView({ item }: { item: RecentlyViewedItem }) {
  useEffect(() => {
    recordProductView(item);
    // Only re-run if the viewed product actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.slug]);

  return null;
}
