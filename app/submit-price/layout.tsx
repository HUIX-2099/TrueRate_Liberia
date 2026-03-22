import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Submit Market Price — TrueRate Liberia Price Index",
  description:
    "Help TrueRate Liberia track real essential goods prices across Monrovia, Buchanan, Gbarnga and beyond. Submit prices to build Liberia's most accurate community price index.",
  keywords: [
    "submit price Liberia",
    "Liberia price index community",
    "essential goods prices Liberia",
    "food prices Monrovia",
    "fair price check Liberia",
    "TrueRate price submission",
  ],
  alternates: {
    canonical: "https://truerateliberia.com/submit",
  },
}

export default function SubmitPriceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
