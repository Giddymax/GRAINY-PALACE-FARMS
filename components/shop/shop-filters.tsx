"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatGHS } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { productTags } from "@/lib/taxonomy";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name", label: "Name (A–Z)" },
];

export function ShopFilters({
  priceMin = 0,
  priceMax,
}: {
  priceMin?: number;
  priceMax: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = React.useTransition();
  const [search, setSearch] = React.useState(searchParams.get("q") ?? "");

  const activeTags = React.useMemo(
    () => new Set(searchParams.get("tags")?.split(",").filter(Boolean) ?? []),
    [searchParams]
  );
  const sort = searchParams.get("sort") ?? "newest";
  const availableOnly = searchParams.get("available") === "1";
  const priceFrom = Number(searchParams.get("min") ?? priceMin);
  const priceTo = Number(searchParams.get("max") ?? priceMax);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([priceFrom, priceTo]);

  React.useEffect(() => {
    setPriceRange([priceFrom, priceTo]);
  }, [priceFrom, priceTo]);

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  React.useEffect(() => {
    const handle = setTimeout(() => {
      if (search !== (searchParams.get("q") ?? "")) {
        updateParams((p) => (search ? p.set("q", search) : p.delete("q")));
      }
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function toggleTag(tag: string) {
    updateParams((p) => {
      const tags = new Set(activeTags);
      if (tags.has(tag)) tags.delete(tag);
      else tags.add(tag);
      if (tags.size > 0) p.set("tags", Array.from(tags).join(","));
      else p.delete("tags");
    });
  }

  const filterBody = (
    <div className="flex flex-col gap-6">
      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sort by
        </Label>
        <Select
          value={sort}
          onValueChange={(value) => updateParams((p) => p.set("sort", value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Price range
          </Label>
          <span className="text-xs text-muted-foreground">
            {formatGHS(priceRange[0])} – {formatGHS(priceRange[1])}
          </span>
        </div>
        <Slider
          min={priceMin}
          max={priceMax}
          step={Math.max(1, Math.round((priceMax - priceMin) / 100))}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          onValueCommit={(value) =>
            updateParams((p) => {
              p.set("min", String(value[0]));
              p.set("max", String(value[1]));
            })
          }
        />
      </div>

      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Tags
        </Label>
        <div className="flex flex-col gap-2">
          {productTags.map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={activeTags.has(tag)}
                onCheckedChange={() => toggleTag(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={availableOnly}
            onCheckedChange={(checked) =>
              updateParams((p) => (checked ? p.set("available", "1") : p.delete("available")))
            }
          />
          In stock only
        </label>
      </div>

      {(activeTags.size > 0 || availableOnly || searchParams.get("q")) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch("");
            router.push(pathname);
          }}
        >
          Clear filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="pl-9"
            aria-label="Search products"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 lg:hidden" aria-label="Filters">
              <SlidersHorizontal className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">{filterBody}</div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden rounded-xl border border-border bg-card p-4 lg:block">
        {filterBody}
      </div>
      <span className="sr-only" aria-live="polite">
        {pending ? "Updating results…" : ""}
      </span>
    </div>
  );
}
