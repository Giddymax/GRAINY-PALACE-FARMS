"use client";

import * as React from "react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { saveProductAction, type ProductActionState } from "@/lib/actions/admin/products";
import { slugify } from "@/lib/validations/article";
import { categories, productUnits, productTags } from "@/lib/taxonomy";
import type { Product } from "@/lib/data/products";

export function ProductForm({ product }: { product?: Product | null }) {
  const [state, formAction, pending] = useActionState<ProductActionState, FormData>(
    saveProductAction,
    null
  );
  const [name, setName] = React.useState(product?.name ?? "");
  const [slug, setSlug] = React.useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(Boolean(product));
  const [category, setCategory] = React.useState(product?.category ?? categories[0].slug);

  const subcategories = categories.find((c) => c.slug === category)?.subcategories ?? [];

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Select name="category" value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subcategory">Subcategory</Label>
            <Select name="subcategory" defaultValue={product?.subcategory} key={category}>
              <SelectTrigger id="subcategory" className="w-full">
                <SelectValue placeholder="Choose subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((s) => (
                  <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={3} required defaultValue={product?.description} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Price (GHS)</Label>
            <Input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={product?.price} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="unit">Unit</Label>
            <Select name="unit" defaultValue={product?.unit}>
              <SelectTrigger id="unit" className="w-full">
                <SelectValue placeholder="Choose unit" />
              </SelectTrigger>
              <SelectContent>
                {productUnits.map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tags">Tags (comma-separated — {productTags.join(", ")})</Label>
          <Input id="tags" name="tags" defaultValue={product?.tags?.join(", ") ?? ""} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="traceabilityNote">Traceability note</Label>
          <Input
            id="traceabilityNote"
            name="traceabilityNote"
            defaultValue={product?.traceability_note ?? "Farm-to-fork QR traceable."}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
          <ImageUpload name="imageUrl" folder="products" defaultValue={product?.image_url} label="Product image" />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sortOrder">Sort order</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={product?.sort_order ?? 0} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="stockQuantity">Stock count (optional)</Label>
            <Input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="0"
              placeholder="Leave blank to hide the stock count"
              defaultValue={product?.stock_quantity ?? ""}
            />
            <p className="text-xs text-muted-foreground">
              Shown to shoppers as a &quot;Only N left&quot; nudge when 5 or fewer.
            </p>
          </div>

          <label className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Available for sale</span>
            <Switch name="isAvailable" defaultChecked={product?.is_available ?? true} />
          </label>
        </div>

        {state?.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
