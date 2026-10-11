import { Skeleton } from "@/components/ui/skeleton";

/** Generic page-level loading skeleton for route groups without a bespoke one. */
export function PageSkeleton({
  variant = "default",
}: {
  variant?: "default" | "form" | "grid" | "list";
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="mb-2 h-9 w-64 max-w-full" />
      <Skeleton className="mb-8 h-5 w-96 max-w-full" />

      {variant === "grid" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      )}

      {variant === "list" && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {variant === "form" && (
        <div className="mx-auto flex max-w-xl flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-lg" />
          ))}
          <Skeleton className="h-11 w-40 rounded-lg" />
        </div>
      )}

      {variant === "default" && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}
    </div>
  );
}
