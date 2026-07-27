"use client";

import * as React from "react";
import type { CartItem } from "@/lib/cart/types";

const STORAGE_KEY = "gpf.cart.v1";

type CartState = {
  items: CartItem[];
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

function readStorage(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as CartState;
    return { items: Array.isArray(parsed.items) ? parsed.items : [] };
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setItems(readStorage().items);
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
  }, [items, hydrated]);

  const addItem = React.useCallback<CartContextValue["addItem"]>(
    (item, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...item, quantity }];
      });
    },
    []
  );

  const removeItem = React.useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = React.useCallback(
    (productId: string, quantity: number) => {
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => i.productId !== productId)
          : prev.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            )
      );
    },
    []
  );

  const clear = React.useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const value = React.useMemo(
    () => ({ items, itemCount, subtotal, addItem, removeItem, updateQuantity, clear }),
    [items, itemCount, subtotal, addItem, removeItem, updateQuantity, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
