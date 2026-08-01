import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The brand's real heritage seal (rope border, wheat, cattle, crown) — the
 * single logo asset used everywhere: header, mobile nav, footer, admin.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/grainy-palace-farms-seal.png"
      alt=""
      width={64}
      height={64}
      priority
      className={cn("size-9 shrink-0 rounded-full object-cover", className)}
    />
  );
}

export function WordMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Grainy Palace
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold-600 dark:text-gold-300">
          Farms
        </span>
      </span>
    </span>
  );
}
