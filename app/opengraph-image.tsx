import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #12301c 0%, #1e5631 100%)",
          color: "#fbf7ee",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#e2a72e",
            }}
          />
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.5 }}>
            Grainy Palace Farm
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, maxWidth: 900, lineHeight: 1.15 }}>
          {siteConfig.tagline}
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 24, color: "#d5e6da", maxWidth: 800 }}>
          {siteConfig.brandPromise}
        </div>
      </div>
    ),
    { ...size }
  );
}
