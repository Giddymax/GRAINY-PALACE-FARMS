"use client";

import * as React from "react";
import { useActionState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import { saveInventoryItemAction, type InventoryActionState } from "@/lib/actions/admin/inventory";
import { productUnits } from "@/lib/taxonomy";
import { formatGHS } from "@/lib/format";
import type { Database } from "@/lib/supabase/database.types";

type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"];

export function InventoryFormDialog({ item }: { item?: InventoryItem }) {
  const [open, setOpen] = React.useState(false);
  const [state, formAction, pending] = useActionState<InventoryActionState, FormData>(
    saveInventoryItemAction,
    null
  );
  const [price, setPrice] = React.useState<number | "">(item?.price ?? "");
  const [costPrice, setCostPrice] = React.useState<number | "">(item?.cost_price ?? "");

  const effectiveCost = costPrice === "" ? (price === "" ? 0 : price) : costPrice;
  const margin = price === "" ? 0 : Number(price) - Number(effectiveCost);
  const marginPct = price && Number(price) > 0 ? (margin / Number(price)) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {item ? (
          <Button size="icon-sm" variant="ghost" aria-label="Edit item">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-1 size-4" /> New item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Edit inventory item" : "New inventory item"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          {item && <input type="hidden" name="id" value={item.id} />}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="inv-name">Name</Label>
            <Input id="inv-name" name="name" required defaultValue={item?.name} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-category">Category</Label>
              <Input id="inv-category" name="category" required defaultValue={item?.category} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-unit">Unit</Label>
              <select
                id="inv-unit"
                name="unit"
                defaultValue={item?.unit ?? productUnits[0]}
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              >
                {productUnits.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <ImageUpload name="imageUrl" folder="inventory" defaultValue={item?.image_url} label="Photo (optional)" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-price">Sale price (GHS)</Label>
              <Input
                id="inv-price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-cost">Cost price (optional)</Label>
              <Input
                id="inv-cost"
                name="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Defaults to sale price"
              />
            </div>
          </div>

          <div className="rounded-md bg-muted px-3 py-2 text-sm">
            Margin:{" "}
            <span className={margin < 0 ? "text-destructive" : "font-medium text-forest-700 dark:text-forest-300"}>
              {formatGHS(margin)} ({marginPct.toFixed(1)}%)
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-stock">Stock quantity</Label>
              <Input id="inv-stock" name="stockQuantity" type="number" step="0.01" min="0" required defaultValue={item?.stock_quantity ?? 0} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-threshold">Low-stock threshold</Label>
              <Input id="inv-threshold" name="lowStockThreshold" type="number" step="0.01" min="0" required defaultValue={item?.low_stock_threshold ?? 10} />
            </div>
          </div>

          <label className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Active</span>
            <Switch name="isActive" defaultChecked={item?.is_active ?? true} />
          </label>

          {state?.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
