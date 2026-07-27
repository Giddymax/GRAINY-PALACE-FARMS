import Image from "next/image";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/shop/category-icon";
import type { CategoryIconName } from "@/lib/taxonomy";

/**
 * Renders the product photo when one has been uploaded via the admin
 * Catalogue, otherwise falls back to a branded icon tile keyed to the
 * product's category (a stand-in for real photography, not decoration).
 */
export function ProductImage({
  src,
  alt,
  categoryIcon = "package",
  sizes,
  fill = true,
  className,
  priority,
}: {
  src: string | null;
  alt: string;
  categoryIcon?: CategoryIconName;
  sizes?: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-forest-100 to-gold-100 dark:from-forest-900 dark:to-forest-800",
          fill && "absolute inset-0",
          className
        )}
      >
        <CategoryIcon
          name={categoryIcon}
          className="size-10 text-forest-600 dark:text-forest-300"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
      className={cn("object-cover", className)}
      priority={priority}
    />
  );
}
