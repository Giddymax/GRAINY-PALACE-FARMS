import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Renders the product photo when one has been uploaded via the admin
 * Catalogue, otherwise falls back to a neutral branded color tile.
 */
export function ProductImage({
  src,
  alt,
  sizes,
  fill = true,
  className,
  priority,
}: {
  src: string | null;
  alt: string;
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
      />
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
