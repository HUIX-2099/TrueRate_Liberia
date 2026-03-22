import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { InvestPageClient } from "@/components/invest/invest-page-client"

export const metadata: Metadata = {
  title: "Investment Intelligence Dashboard | TrueRate Liberia",
  description:
    "Real-time market data and economic insights for Liberia. USD/LRD rates, volatility, inflation, risk scoring, and regional analysis for investors and policymakers.",
  openGraph: {
    title: "Investment Intelligence Dashboard | TrueRate Liberia",
    description:
      "Real-time market data and economic insights. KPIs, volatility, risk scoring, and regional analysis.",
    type: "website",
  },
}

export default function InvestPage() {
  return (
    <div className="min-h-screen flex flex-col invest-dashboard-page">
      <Header />
      <InvestPageClient />
      <Footer />
    </div>
  )
}
