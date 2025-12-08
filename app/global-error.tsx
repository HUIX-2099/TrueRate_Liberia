"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}>
          <div style={{
            maxWidth: "28rem",
            width: "100%",
            textAlign: "center",
          }}>
            <div style={{
              width: "4rem",
              height: "4rem",
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}>
              Something went wrong!
            </h2>
            <p style={{
              color: "#a1a1aa",
              marginBottom: "1.5rem",
            }}>
              We're sorry, but an unexpected error occurred. Please try again.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                onClick={reset}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = "/"}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "transparent",
                  color: "#fafafa",
                  border: "1px solid #27272a",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}



