import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Shared brand logo used throughout the site and admin areas.
 */
export function LogoMark({ className }: { className?: string }) {
  return <Image src="/brand/grainy-palace-farms-seal.png" alt="Grainy Palace Farms — Safe Food for All" width={64} height={64} className={cn("size-12 object-contain", className)} />;
}

export function WordMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <LogoMark />
    </span>
  );
}
