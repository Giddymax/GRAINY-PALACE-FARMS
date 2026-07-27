import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/shop/category-icon";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <CategoryIcon name="sprout" className="size-14 text-forest-600" />
      <h1 className="font-heading text-3xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        We couldn&apos;t find that page. It may have moved, or the link may be
        out of date.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop">Go to shop</Link>
        </Button>
      </div>
    </div>
  );
}
