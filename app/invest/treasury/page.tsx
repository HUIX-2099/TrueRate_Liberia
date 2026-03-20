import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { Badge } from "@/components/ui/badge"
import { TreasuryBondsDashboard } from "@/components/invest/treasury-bonds"

export const metadata: Metadata = {
  title: "Treasury Bills & Bonds | TrueRate Liberia",
  description:
    "Government Treasury bills and bonds issued by the Central Bank of Liberia. View current offerings, yield curve, auction calendar, and calculate investment returns.",
  openGraph: {
    title: "CBL Treasury Bills & Bonds | TrueRate Liberia",
    description:
      "Government securities issued by the Central Bank of Liberia — T-bills, bonds, yield curve, auction calendar.",
    type: "website",
  },
}

export default function TreasuryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden" role="main">
        <section
          className="relative py-8 sm:py-10 md:py-12 overflow-x-hidden rounded-b-2xl dark:from-[#080d18] dark:via-[#0f1620] dark:to-[#080d18]"
          aria-labelledby="treasury-hero-heading"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />
          <PageContainer maxWidth="6xl" className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge
                variant="secondary"
                className="text-[10px] font-medium bg-white/10 text-white/90 border-white/20 uppercase tracking-wider"
              >
                Government Securities
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-medium uppercase tracking-wider">
                Now Accepting Bids
              </Badge>
            </div>
            <h1
              id="treasury-hero-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-display text-white text-balance mb-1"
            >
              Treasury Bills & Bonds
            </h1>
            <p className="text-sm text-white/70 text-pretty mb-2 max-w-2xl">
              Government debt securities issued by the Central Bank of Liberia (CBL). Invest in
              sovereign-backed T-bills and bonds with competitive yields across multiple tenors.
            </p>
          </PageContainer>
        </section>

        <section className="py-6 sm:py-8 md:py-10 bg-background" aria-label="Treasury securities dashboard">
          <PageContainer maxWidth="6xl">
            <TreasuryBondsDashboard />
          </PageContainer>
        </section>
      </main>
      <Footer />
    </div>
  )
}
