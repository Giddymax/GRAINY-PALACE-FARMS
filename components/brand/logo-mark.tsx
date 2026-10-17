import Image from "next/image";
import { cn } from "@/lib/utils";

/** Green-lettered farm seal shared across public and admin pages. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/grainy-palace-farms-seal.png"
      alt="Grainy Palace Farms — Safe Food for All"
      width={64}
      height={64}
      priority
      className={cn("size-12 shrink-0 object-contain sm:size-14", className)}
    />
  );
}

export function WordMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <LogoMark />
    </span>
  );
}
