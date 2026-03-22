import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TRFN Economic Outlook — Live USD/LRD Signals & Market Intelligence",
  description:
    "TRFN delivers live economic signals shaping Liberia's economy — USD/LRD rates, parallel market spreads, fuel, food, transport trends, and AI-powered market analysis by TrueRate Liberia.",
  keywords: [
    "TRFN economic outlook",
    "USD LRD rate today",
    "dollar rate Liberia today",
    "Liberia economic signals",
    "parallel market rate Liberia",
    "TRFN dashboard",
    "TrueRate Liberia market",
    "CBL rate today",
    "fuel price Liberia",
    "food index Liberia",
    "transport fares Liberia",
    "LRD stability",
    "TRFN AI analyst",
  ],
  openGraph: {
    title: "TRFN Economic Outlook — TrueRate Liberia",
    description:
      "Live signals shaping Liberia's economy — USD/LRD, price trends, and AI market analysis.",
    url: "https://truerateliberia.com/trfn-dashboard",
  },
  alternates: {
    canonical: "https://truerateliberia.com/trfn-dashboard",
  },
}

export default function TrfnDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
