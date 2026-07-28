"use client";

import * as React from "react";

/**
 * Cart writes are synchronous (localStorage, no server round-trip — see
 * lib/cart/context.tsx), so there's no pending state for useOptimistic to
 * bridge. This gives the same instant "Added" affordance via a timed pulse
 * instead, without misapplying a hook meant for async transitions.
 */
export function useAddedFeedback(durationMs = 1200) {
  const [justAdded, setJustAdded] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const pulse = React.useCallback(() => {
    setJustAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setJustAdded(false), durationMs);
  }, [durationMs]);

  return [justAdded, pulse] as const;
}
