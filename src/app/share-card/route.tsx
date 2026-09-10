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
          background:
            "linear-gradient(165deg, #05080f 0%, #0a121c 50%, #0a1a16 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: "#10b981",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px 56px",
            maxWidth: 920,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 22,
              background: "linear-gradient(145deg, #34d399 0%, #0d9488 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 28,
              boxShadow: "0 12px 40px rgba(16,185,129,0.35)",
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 800,
                color: "#042f2e",
                letterSpacing: -1,
              }}
            >
              TS
            </div>
          </div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 5,
              color: "#34d399",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Personal exposure intelligence
          </div>

          <div
            style={{
              fontSize: 50,
              fontWeight: 700,
              color: "#fafafa",
              lineHeight: 1.12,
              letterSpacing: -1.2,
              marginBottom: 18,
            }}
          >
            Know what could break before it does.
          </div>

          <div
            style={{
              fontSize: 22,
              color: "#a1a1aa",
              lineHeight: 1.45,
              maxWidth: 680,
              marginBottom: 36,
            }}
          >
            Measure financial, digital, food, and payment exposure. See your
            break points — then fix them.
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                background: "#064e3b",
                color: "#6ee7b7",
                padding: "10px 18px",
                borderRadius: 999,
                fontSize: 15,
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
                fontSize: 15,
              }}
            >
              12-month plan
            </div>
            <div style={{ color: "#71717a", fontSize: 15, marginLeft: 6 }}>
              tiltshield.xyz
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
