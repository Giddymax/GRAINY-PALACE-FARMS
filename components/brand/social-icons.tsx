/**
 * lucide-react no longer ships brand/social marks (Facebook, Instagram,
 * LinkedIn, X) as of v1 — these are minimal inline replacements.
 */
type IconProps = { className?: string };

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-8.2h2.75l.41-3.19h-3.16V7.6c0-.92.26-1.55 1.58-1.55h1.68V3.19C16.44 3.13 15.42 3 14.23 3c-2.47 0-4.16 1.51-4.16 4.28v2.33H7.31v3.19h2.76V21h3.43Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.94 8.5H3.56V20.4h3.38V8.5ZM5.25 3.6a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20.4h-3.38v-6.24c0-1.49-.03-3.4-2.07-3.4-2.08 0-2.4 1.62-2.4 3.3v6.34H9.21V8.5h3.24v1.63h.05c.45-.85 1.56-1.75 3.21-1.75 3.43 0 4.06 2.26 4.06 5.19v6.83Z" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="m4 4 6.6 8.6L4.2 20h2.5l5.1-6 4.1 6H20l-6.9-9.1L19.2 4h-2.5l-4.7 5.5L8 4H4Z" />
    </svg>
  );
}
