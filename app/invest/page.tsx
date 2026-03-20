import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { Badge } from "@/components/ui/badge"
import { InvestHeroKPIs } from "@/components/invest/invest-hero-kpis"
import { VolatilityIndicator } from "@/components/invest/volatility-indicator"
import { InvestExportPdf } from "@/components/invest/invest-export-pdf"
import { EconomicOutlookPanel } from "@/components/invest/economic-outlook-panel"
import { RiskScoringSummary } from "@/components/invest/risk-scoring-summary"
import { InvestmentOpportunities } from "@/components/invest/investment-opportunities"
import { RegionalInsights } from "@/components/invest/regional-insights"
import { DataTransparency } from "@/components/invest/data-transparency"
import { InvestCTA } from "@/components/invest/invest-cta"
import { DollarizationRiskIndicator } from "@/components/dollarization-risk-indicator"
import { TreasuryBondsDashboard } from "@/components/invest/treasury-bonds"

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
      <main
        id="invest-dashboard-print"
        className="flex-1 pb-20 md:pb-0 overflow-x-hidden"
        role="main"
      >
        {/* Hero — Bloomberg-style: dense, gradient, KPIs + volatility + export */}
        <section
          className="relative py-8 sm:py-10 md:py-12 overflow-x-hidden rounded-b-2xl dark:from-[#080d18] dark:via-[#0f1620] dark:to-[#080d18] border-b border-white/10 md:border-0"
          aria-labelledby="invest-hero-heading"
        >
          <div className="absolute inset-0 md:hidden pointer-events-none bg-[radial-gradient(ellipse_90%_60%_at_20%_-10%,rgba(59,130,246,0.12),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(34,197,94,0.08),transparent_50%)]" aria-hidden />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />
          <PageContainer maxWidth="6xl" className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-[10px] font-medium bg-white/10 text-white/90 border-white/20 uppercase tracking-wider">
                  Dashboard
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-medium uppercase tracking-wider">
                  Live
                </Badge>
                <VolatilityIndicator variant="dark" />
              </div>
              <div className="no-print">
                <InvestExportPdf className="h-8 rounded-lg border-white/20 text-white/90 hover:bg-white/10" />
              </div>
            </div>
            <h1
              id="invest-hero-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-display text-white text-balance mb-1"
            >
              Investment Intelligence Dashboard
            </h1>
            <p className="text-sm text-white/70 text-pretty mb-6">
              Real-Time Market Data & Economic Insights
            </p>
            <InvestHeroKPIs />
          </PageContainer>
        </section>

        {/* LRD health — simplified stability score */}
        <section className="py-6 sm:py-8 bg-[#0c1222] dark:bg-[#080d18] border-b border-white/10" aria-label="LRD health">
          <PageContainer maxWidth="6xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/70">
                LRD health indicator
              </h2>
              <span className="text-[10px] text-white/50">USD preference · LRD trend · Liquidity stress</span>
            </div>
            <div className="max-w-2xl">
              <DollarizationRiskIndicator variant="dark" />
            </div>
          </PageContainer>
        </section>

        {/* Top grid: Economic outlook + dense metrics */}
        <section className="py-6 sm:py-8 bg-background border-b border-border/50" aria-label="Economic overview">
          <PageContainer maxWidth="6xl">
            <EconomicOutlookPanel />
          </PageContainer>
        </section>

        {/* Investment Opportunities — risk summary + cards */}
        <section
          className="py-6 sm:py-8 md:py-10 bg-background"
          aria-labelledby="opportunities-heading"
        >
          <PageContainer maxWidth="6xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 id="opportunities-heading" className="text-base sm:text-lg font-bold tracking-tight text-foreground uppercase">
                Investment Opportunities
              </h2>
              <RiskScoringSummary />
            </div>
            <p className="text-xs text-muted-foreground mb-4 max-w-2xl">
              Sector overview with risk score (1–10), expected return, and region. View Analysis for detailed data.
            </p>
            <InvestmentOpportunities />
          </PageContainer>
        </section>

        {/* Treasury Bills & Bonds */}
        <section
          className="py-6 sm:py-8 md:py-10 bg-muted/20 border-t border-border/50"
          aria-labelledby="treasury-heading"
        >
          <PageContainer maxWidth="6xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
              <h2 id="treasury-heading" className="text-base sm:text-lg font-bold tracking-tight text-foreground uppercase">
                Treasury Bills & Bonds
              </h2>
              <Link
                href="/invest/treasury"
                className="text-xs font-medium text-primary hover:underline underline-offset-4"
              >
                View Full Dashboard →
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mb-4 max-w-2xl">
              Government securities issued by the Central Bank of Liberia (CBL). Sovereign-backed T-bills and bonds with competitive yields.
            </p>
            <TreasuryBondsDashboard />
          </PageContainer>
        </section>

        {/* Regional Insights */}
        <section
          className="py-6 sm:py-8 md:py-10 bg-muted/20 border-t border-border/50"
          aria-labelledby="regional-heading"
        >
          <PageContainer maxWidth="6xl">
            <h2 id="regional-heading" className="text-base sm:text-lg font-bold tracking-tight text-foreground uppercase mb-4">
              Regional Insights
            </h2>
            <RegionalInsights />
          </PageContainer>
        </section>

        {/* Data Transparency */}
        <section className="py-6 sm:py-8 bg-background" aria-labelledby="transparency-heading">
          <PageContainer maxWidth="4xl">
            <h2 id="transparency-heading" className="sr-only">
              Data transparency and disclaimer
            </h2>
            <DataTransparency />
          </PageContainer>
        </section>

        {/* CTA */}
        <section className="py-6 sm:py-8 md:py-10 bg-background border-t border-border/50">
          <PageContainer maxWidth="4xl">
            <InvestCTA />
          </PageContainer>
        </section>
      </main>
      <Footer />
    </div>
  )
}
