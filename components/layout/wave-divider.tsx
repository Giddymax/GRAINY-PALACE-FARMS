/** Organic wave section-break, matching the brand's "food-fresh, not corporate" direction. */
export function WaveDivider({
  className,
  fill = "var(--color-background)",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 32C240 72 480 72 720 48C960 24 1200 8 1440 32V80H0V32Z"
        fill={fill}
      />
    </svg>
  );
}
