import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#05070c",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 280,
            background:
              "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(16,185,129,0.18), transparent)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(145deg, #34d399, #0d9488)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 800,
                color: "#042f2e",
              }}
            >
              TS
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#f4f4f5" }}>
              Tiltshield
            </div>
          </div>
          <div
            style={{
              background: "#10b981",
              color: "#042f2e",
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Find your exposure
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "80px 64px 40px",
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 4,
              color: "#34d399",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            Personal exposure intelligence
          </div>

          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#fafafa",
              lineHeight: 1.12,
              letterSpacing: -1.2,
              marginBottom: 8,
            }}
          >
            The world is less stable than you
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#fafafa",
              lineHeight: 1.12,
              letterSpacing: -1.2,
              marginBottom: 12,
            }}
          >
            think.
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#34d399",
              lineHeight: 1.15,
              letterSpacing: -1,
              marginBottom: 28,
            }}
          >
            How exposed are you?
          </div>

          <div
            style={{
              fontSize: 18,
              color: "#a1a1aa",
              lineHeight: 1.5,
              maxWidth: 640,
              marginBottom: 36,
            }}
          >
            You might have a salary, a bank app, and a full fridge. That does not
            tell you how many days you last when one of them fails.
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                background: "#10b981",
                color: "#042f2e",
                padding: "14px 28px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Measure my exposure
            </div>
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#e4e4e7",
                padding: "14px 28px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              What is a break point?
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    }
  );
}
