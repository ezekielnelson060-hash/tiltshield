import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TiltShield — Know what could break before it does";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "linear-gradient(160deg, #060a12 0%, #0c1624 55%, #0a1f1a 100%)",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 10,
            background: "#10b981",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "linear-gradient(135deg, #34d399, #0d9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#042f2e",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            TS
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#fafafa",
                letterSpacing: 2,
              }}
            >
              TILTSHIELD
            </div>
            <div style={{ fontSize: 16, color: "#6ee7b7", letterSpacing: 3 }}>
              PERSONAL EXPOSURE INTELLIGENCE
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 52,
            fontWeight: 700,
            color: "#fafafa",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Know what could break before it does.
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 26,
            color: "#a1a1aa",
            maxWidth: 820,
            lineHeight: 1.4,
          }}
        >
          Measure financial, digital, food, and payment exposure. See your break
          points — then fix them.
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 16, alignItems: "center" }}>
          <div
            style={{
              background: "#064e3b",
              color: "#6ee7b7",
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Break points
          </div>
          <div
            style={{
              background: "#18181b",
              color: "#d4d4d8",
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 18,
            }}
          >
            12-month plan
          </div>
          <div style={{ color: "#71717a", fontSize: 18, marginLeft: 12 }}>
            tiltshield.xyz
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
