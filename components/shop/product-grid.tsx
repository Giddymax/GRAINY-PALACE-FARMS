import { PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/lib/data/products";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <PackageSearch className="size-10 text-muted-foreground" />
        <p className="font-medium">No products match your filters</p>
        <p className="text-sm text-muted-foreground">
          Try clearing a filter or searching a different term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
