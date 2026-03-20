"use client"

import { DiasporaTrustPreview } from "@/components/diaspora/diaspora-trust-preview"

export function TrustPanel() {
  return (
    <section
      id="trust"
      className="scroll-mt-28 pt-2"
      aria-labelledby="trust-heading"
    >
      <h2 id="trust-heading" className="sr-only">
        Trust & transparency
      </h2>
      <DiasporaTrustPreview />
    </section>
  )
}
