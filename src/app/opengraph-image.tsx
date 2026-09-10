import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#05070c",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -60,
            width: 480,
            height: 480,
            borderRadius: 999,
            background: "rgba(16,185,129,0.12)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -40,
            bottom: -80,
            width: 360,
            height: 360,
            borderRadius: 999,
            background: "rgba(13,148,136,0.08)",
            display: "flex",
          }}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 40px 48px 56px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(145deg, #34d399, #0d9488)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 800,
                color: "#042f2e",
              }}
            >
              TS
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#f4f4f5",
                letterSpacing: 0.5,
              }}
            >
              tiltshield
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 3.5,
                color: "#34d399",
                textTransform: "uppercase",
              }}
            >
              Personal exposure intelligence
            </div>
            <div
              style={{
                fontSize: 54,
                fontWeight: 700,
                color: "#fafafa",
                lineHeight: 1.08,
                letterSpacing: -1.5,
                maxWidth: 560,
              }}
            >
              Know what could break before it does.
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#a1a1aa",
                lineHeight: 1.4,
                maxWidth: 480,
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
                padding: "8px 14px",
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
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 14,
              }}
            >
              12-month plan
            </div>
            <div style={{ color: "#52525b", fontSize: 14, marginLeft: 4 }}>
              tiltshield.xyz
            </div>
          </div>
        </div>

        <div
          style={{
            width: 420,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            paddingRight: 40,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 280,
              height: 340,
              borderRadius: 20,
              border: "1px solid rgba(52,211,153,0.15)",
              background: "rgba(16,185,129,0.04)",
              transform: "rotate(6deg)",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 280,
              height: 340,
              borderRadius: 20,
              border: "1px solid rgba(52,211,153,0.25)",
              background: "rgba(16,185,129,0.06)",
              transform: "rotate(-4deg)",
              display: "flex",
            }}
          />
          <div
            style={{
              width: 280,
              height: 340,
              borderRadius: 20,
              border: "1px solid rgba(52,211,153,0.45)",
              background: "linear-gradient(160deg, #0c1620 0%, #0a1f1a 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 2,
                color: "#6ee7b7",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Shortest clock
            </div>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 999,
                border: "3px solid rgba(52,211,153,0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: "#fafafa",
                  lineHeight: 1,
                }}
              >
                31
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#34d399",
                  letterSpacing: 2,
                  marginTop: 4,
                }}
              >
                DAYS
              </div>
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#a1a1aa",
                textAlign: "center",
                maxWidth: 200,
                lineHeight: 1.35,
              }}
            >
              Financial break point if income stops
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 12,
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
    { ...size }
  );
}
