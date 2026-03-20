import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketIntelligenceFullDashboard } from "@/components/market-intelligence/market-intelligence-full-dashboard"

export const metadata = {
  title: "Market analytics dashboard | TrueRate Liberia",
  description:
    "Commodity charts, import trends, price monitoring tables, sync logs, and data sources for Liberia.",
}

export default function MarketIntelligenceAnalyticsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <MarketIntelligenceFullDashboard />
      <Footer />
    </div>
  )
}
