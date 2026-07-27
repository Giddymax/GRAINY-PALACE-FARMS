import { cn } from "@/lib/utils";

/**
 * Simplified nav wordmark: a grain head merging into a crown, on a green field.
 * The full rope-bordered heritage seal (public/brand/grainy-palace-farms-seal.png)
 * is used separately on About/Certifications/footer as a badge of provenance.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("size-9", className)}
      role="img"
      aria-label="Grainy Palace Farm crest"
    >
      <circle cx="24" cy="24" r="23" fill="var(--color-forest-600)" />
      <path
        d="M24 8c1.6 2 2.4 4 2.4 6.4 0 1.8-.7 3.2-1.6 4.4 1.4.4 2.6 1.4 2.6 3.2 0 1.6-1 2.8-2.2 3.4 1.6.6 2.8 1.8 2.8 3.6 0 2.6-2.4 4.2-4 5.6-1.6-1.4-4-3-4-5.6 0-1.8 1.2-3 2.8-3.6-1.2-.6-2.2-1.8-2.2-3.4 0-1.8 1.2-2.8 2.6-3.2-.9-1.2-1.6-2.6-1.6-4.4C21.6 12 22.4 10 24 8Z"
        fill="var(--color-gold-400)"
      />
      <path
        d="M14 33c2-4 5.6-6.4 10-6.4s8 2.4 10 6.4c-3 1.6-6.4 2.6-10 2.6s-7-1-10-2.6Z"
        fill="var(--color-gold-300)"
      />
    </svg>
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
          Farm
        </span>
      </span>
    </span>
  );
}
