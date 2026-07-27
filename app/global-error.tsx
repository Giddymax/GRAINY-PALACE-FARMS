"use client";

import { useEffect } from "react";

/**
 * Catches errors thrown by the root layout itself (fonts, providers, etc.).
 * Must render its own <html>/<body> since the root layout has failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          background: "#fbf7ee",
          color: "#2a2420",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>
          Grainy Palace Farm — something went wrong
        </h1>
        <p style={{ color: "#6b6255", maxWidth: 420 }}>
          We&apos;ve hit an unexpected error loading the site. Please try
          again in a moment.
        </p>
        <button
          onClick={reset}
          style={{
            background: "#1e5631",
            color: "#fbf7ee",
            padding: "0.6rem 1.4rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
