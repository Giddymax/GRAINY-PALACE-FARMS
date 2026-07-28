"use client";

const STORAGE_KEY = "gpf.recently-viewed.v1";
const MAX_ITEMS = 8;

export type RecentlyViewedItem = {
  slug: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string | null;
};

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordProductView(item: RecentlyViewedItem) {
  if (typeof window === "undefined") return;
  const current = getRecentlyViewed().filter((i) => i.slug !== item.slug);
  const next = [item, ...current].slice(0, MAX_ITEMS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
