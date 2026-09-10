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
          background: "#05070c",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 36px 52px 56px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "linear-gradient(145deg, #34d399, #0d9488)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 800,
                color: "#042f2e",
              }}
            >
              TS
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fafafa",
                  letterSpacing: 0.3,
                }}
              >
                tiltshield
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#34d399",
                  letterSpacing: 2,
                }}
              >
                EXPOSURE INTELLIGENCE
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: "#fafafa",
                lineHeight: 1.1,
                letterSpacing: -1.2,
                marginBottom: 18,
              }}
            >
              Know what could break before it does.
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#a1a1aa",
                lineHeight: 1.4,
                maxWidth: 520,
              }}
            >
              Financial. Digital. Food. Payment. One number you cannot unsee.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{
                background: "#064e3b",
                color: "#6ee7b7",
                padding: "9px 16px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Break points
            </div>
            <div
              style={{
                background: "#18181b",
                color: "#d4d4d8",
                padding: "9px 16px",
                borderRadius: 999,
                fontSize: 14,
              }}
            >
              12-month plan
            </div>
            <div style={{ color: "#71717a", fontSize: 14, marginLeft: 6 }}>
              tiltshield.xyz
            </div>
          </div>
        </div>

        <div
          style={{
            width: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg, #071210 0%, #05070c 100%)",
            borderLeft: "1px solid rgba(52,211,153,0.15)",
          }}
        >
          <div
            style={{
              width: 300,
              height: 380,
              borderRadius: 24,
              border: "1px solid rgba(52,211,153,0.4)",
              background: "linear-gradient(160deg, #0c1620 0%, #0a1f1a 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.55)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 2.5,
                color: "#6ee7b7",
                marginBottom: 16,
              }}
            >
              SHORTEST CLOCK
            </div>
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: 999,
                border: "3px solid rgba(52,211,153,0.55)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  color: "#fafafa",
                  lineHeight: 1,
                }}
              >
                31
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#34d399",
                  letterSpacing: 3,
                  marginTop: 6,
                }}
              >
                DAYS
              </div>
            </div>
            <div
              style={{
                fontSize: 15,
                color: "#a1a1aa",
                textAlign: "center",
                maxWidth: 220,
                lineHeight: 1.35,
              }}
            >
              Financial break point if income stops
            </div>
            <div
              style={{
                marginTop: 22,
                fontSize: 13,
                color: "#f87171",
                fontWeight: 600,
              }}
            >
              ● Weakest point
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
