"use client";

import * as React from "react";

export type Theme = "light" | "dark" | "system";
type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "theme";
const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

/**
 * Hand-rolled replacement for next-themes: that package renders its
 * no-flash script via a client component, and under this Next.js/React
 * build that trips a "script tag encountered while rendering" dev error
 * that bubbles into the nearest error boundary. The blocking init script
 * below is rendered directly as trusted SSR body content in app/layout.tsx
 * instead (same fix as the JSON-LD script), so no client-rendered <script>
 * exists here at all.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    let stored: Theme = "system";
    try {
      stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    } catch {
      // ignore
    }
    setThemeState(stored);
    setResolvedTheme(stored === "system" ? getSystemTheme() : stored);
  }, []);

  React.useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    function onChange() {
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      applyTheme(resolved);
    }
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    const resolved = next === "system" ? getSystemTheme() : next;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

/** The literal source run by the blocking script tag in app/layout.tsx — kept
 * here so the logic that decides the pre-hydration class lives next to the
 * context that later takes over. Must stay dependency-free (runs before any
 * JS bundle loads). */
export const THEME_INIT_SCRIPT = `(function(){try{var e=localStorage.getItem("theme")||"system";var d=e==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):e;var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(d);r.style.colorScheme=d;}catch(e){}})();`;
