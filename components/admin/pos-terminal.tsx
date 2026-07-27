"use client";

import * as React from "react";
import { Search, Plus, Minus, X, Printer, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPosSaleAction } from "@/lib/actions/admin/pos";
import { formatGHS, formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/database.types";

type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"];

type CartLine = {
  inventoryItemId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
};

export function PosTerminal({ items }: { items: InventoryItem[] }) {
  const [search, setSearch] = React.useState("");
  const [cart, setCart] = React.useState<CartLine[]>([]);
  const [customerName, setCustomerName] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [receipt, setReceipt] = React.useState<{
    reference: string;
    total: number;
    lines: CartLine[];
    customerName: string;
    date: Date;
  } | null>(null);

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  const total = cart.reduce((sum, l) => sum + l.price * l.quantity, 0);

  function addItem(item: InventoryItem) {
    setCart((prev) => {
      const existing = prev.find((l) => l.inventoryItemId === item.id);
      if (existing) {
        return prev.map((l) =>
          l.inventoryItemId === item.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [...prev, { inventoryItemId: item.id, name: item.name, unit: item.unit, price: item.price, quantity: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) => (l.inventoryItemId === id ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0)
    );
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((l) => l.inventoryItemId !== id));
  }

  async function completeSale() {
    if (cart.length === 0) return;
    setPending(true);
    const result = await createPosSaleAction({
      items: cart.map(({ inventoryItemId, name, unit, price, quantity }) => ({
        inventoryItemId,
        name,
        unit,
        price,
        quantity,
      })),
      customerName,
    });
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setReceipt({
      reference: result.reference,
      total: result.total,
      lines: cart,
      customerName: customerName || "Walk-in customer",
      date: new Date(),
    });
    setCart([]);
    setCustomerName("");
    toast.success("Sale recorded");
  }

  if (receipt) {
    return (
      <div className="mx-auto max-w-sm">
        <div id="receipt" className="rounded-xl border border-border bg-card p-6 font-mono text-sm">
          <p className="text-center font-semibold">{siteConfig.name}</p>
          <p className="text-center text-xs text-muted-foreground">{siteConfig.contact.address}</p>
          <div className="my-3 border-t border-dashed border-border" />
          <p>Ref: {receipt.reference}</p>
          <p>Date: {formatDate(receipt.date)}</p>
          <p>Customer: {receipt.customerName}</p>
          <div className="my-3 border-t border-dashed border-border" />
          {receipt.lines.map((l) => (
            <div key={l.inventoryItemId} className="flex justify-between">
              <span>{l.quantity} × {l.name}</span>
              <span>{formatGHS(l.price * l.quantity)}</span>
            </div>
          ))}
          <div className="my-3 border-t border-dashed border-border" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatGHS(receipt.total)}</span>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Thank you for your business!
          </p>
        </div>
        <div className="mt-4 flex gap-2 print:hidden">
          <Button className="flex-1" onClick={() => window.print()}>
            <Printer className="mr-1 size-4" /> Print receipt
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setReceipt(null)}>
            New sale
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items…"
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => addItem(item)}
              className="flex flex-col items-start gap-1 rounded-lg border border-border bg-card p-3 text-left hover:border-forest-400"
            >
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatGHS(item.price)} / {item.unit}
              </span>
              <span className="text-xs text-muted-foreground">Stock: {item.stock_quantity}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
              No items found.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
          <ShoppingCart className="size-5" /> Sale ({cart.length})
        </h2>
        <Input
          placeholder="Customer name (optional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <ul className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {cart.map((line) => (
            <li key={line.inventoryItemId} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex-1 truncate">{line.name}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => updateQty(line.inventoryItemId, -1)} className="rounded border border-border p-1 hover:bg-muted">
                  <Minus className="size-3" />
                </button>
                <span className="w-6 text-center">{line.quantity}</span>
                <button onClick={() => updateQty(line.inventoryItemId, 1)} className="rounded border border-border p-1 hover:bg-muted">
                  <Plus className="size-3" />
                </button>
                <button onClick={() => removeItem(line.inventoryItemId)} className="ml-1 text-muted-foreground hover:text-destructive">
                  <X className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
          {cart.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Cart is empty</p>
          )}
        </ul>
        <div className="border-t border-border pt-3">
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatGHS(total)}</span>
          </div>
          <Button className="mt-3 w-full" size="lg" disabled={cart.length === 0 || pending} onClick={completeSale}>
            {pending ? "Recording…" : "Complete sale"}
          </Button>
        </div>
      </div>
    </div>
  );
}
