import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "TrueRate Liberia — Trusted Rates and Money Tools"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(6, 182, 212, 0.1)",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            borderRadius: "24px",
            padding: "8px 16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span style={{ color: "#67e8f9", fontSize: "14px", letterSpacing: "0.1em" }}>
            TRFN LIVE
          </span>
        </div>

        <div
          style={{
            fontSize: "64px",
            fontWeight: "800",
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: "24px",
            maxWidth: "800px",
          }}
        >
          TrueRate Liberia
        </div>

        <div
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            marginBottom: "48px",
          }}
        >
          Trusted Rates and Money Tools
        </div>

        <div style={{ display: "flex", gap: "48px" }}>
          {[
            { label: "USD/LRD", value: "Live" },
            { label: "Price Index", value: "Real-time" },
            { label: "Sources", value: "100+" },
            { label: "Accuracy", value: "99.2%" },
          ].map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ color: "#22c55e", fontSize: "22px", fontWeight: "700" }}>
                {stat.value}
              </span>
              <span style={{ color: "#64748b", fontSize: "14px" }}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "80px",
            color: "#475569",
            fontSize: "18px",
          }}
        >
          truerateliberia.com
        </div>
      </div>
    ),
    { ...size }
  )
}
