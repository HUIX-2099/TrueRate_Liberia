import type { Metadata } from "next"
import { DiasporaCartProvider } from "@/lib/diaspora/cart-context"

export const metadata: Metadata = {
  title: "Diaspora Mode | Navigate Home. From Anywhere.",
  description:
    "Centralized digital command center for Liberians abroad: real-time market intelligence, trusted commerce, investment transparency, and remittance optimization.",
  openGraph: {
    title: "Diaspora Mode | TrueRate Liberia",
    description:
      "Navigate the Liberian economy from anywhere. Marketplace, live rates, investments, and remittance tools for the diaspora.",
    type: "website",
  },
}

export default function DiasporaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DiasporaCartProvider>{children}</DiasporaCartProvider>
}
