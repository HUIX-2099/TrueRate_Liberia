"use client"

import { DashboardShell } from "@/components/diaspora/layout"
import { MarketplacePanel } from "@/components/diaspora/Marketplace"
import { IntelligencePanel } from "@/components/diaspora/Intelligence"
import { InvestmentPanel } from "@/components/diaspora/Investment"
import { RemittancePanel } from "@/components/diaspora/Remittance"
import { TrustPanel } from "@/components/diaspora/Trust"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Store, LineChart, Shield, DollarSign, CheckCircle2, Globe, Heart } from "lucide-react"

export default function DiasporaModePage() {
  return (
    <DashboardShell
      rightPanel={
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                <Globe className="h-3.5 w-3.5 text-primary" />
              </div>
              Quick Access
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Jump to market data and tools.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/market-intelligence"
              className="flex items-center justify-between gap-2 rounded-xl border border-border/40 bg-muted/20 px-3.5 py-3 text-sm font-medium text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all"
            >
              <span className="flex items-center gap-2.5">
                <LineChart className="h-4 w-4 text-primary" />
                Market intelligence
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
            <Link
              href="/converter"
              className="flex items-center justify-between gap-2 rounded-xl border border-border/40 bg-muted/20 px-3.5 py-3 text-sm font-medium text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all"
            >
              <span className="flex items-center gap-2.5">
                <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Currency converter
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
            <Link
              href="/invest"
              className="flex items-center justify-between gap-2 rounded-xl border border-border/40 bg-muted/20 px-3.5 py-3 text-sm font-medium text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all"
            >
              <span className="flex items-center gap-2.5">
                <Store className="h-4 w-4 text-primary" />
                Where to invest
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </div>
          <div className="rounded-xl border border-border/40 p-3.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Trust & safety</p>
            <div className="space-y-2">
              {[
                { icon: Shield, label: "Verified vendors" },
                { icon: CheckCircle2, label: "Secure payments" },
                { icon: DollarSign, label: "Pay in USD" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-foreground">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-12 md:space-y-16 max-w-4xl">
        {/* Welcome hero */}
        <section className="relative overflow-hidden rounded-2xl px-6 py-9 sm:px-10 sm:py-12 shadow-lg ring-1 ring-border/40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_30%,rgba(59,130,246,0.12),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_70%,rgba(16,185,129,0.08),transparent_60%)] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-white/15 text-white border-white/30 text-[10px] font-medium uppercase tracking-wider">
                Diaspora Mode
              </Badge>
              <Badge className="bg-rose-400/25 text-rose-100 border-rose-300/40 text-[10px] font-medium">
                Built for diaspora life
              </Badge>
              <Badge className="bg-emerald-500/25 text-emerald-100 border-emerald-300/40 text-[10px] font-medium">
                <span className="relative flex h-1.5 w-1.5 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                Live
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight max-w-xl">
              Stay connected to home in real ways
            </h2>
            <p className="text-sm text-white/85 mt-3 max-w-xl leading-relaxed">
              Use trusted shopping, live rates, and practical tools to support households, students, and
              businesses across Liberia.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1">
                <Heart className="h-3.5 w-3.5 text-rose-300" />
                For households, students, and teams
              </span>
              <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-2.5 py-1">
                Built with diaspora community feedback
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-white/70 uppercase tracking-wider font-medium">For Liberians in:</span>
              {["US", "UK", "Canada", "Australia", "Europe"].map((country) => (
                <span key={country} className="text-[10px] rounded-full border border-white/25 bg-white/10 text-white/90 px-2.5 py-0.5 font-medium">
                  {country}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="sm" className="rounded-xl gap-2 min-h-[44px] font-semibold shadow-md bg-white text-[#0c1222] hover:bg-white/90" asChild>
                <Link href="/diaspora/marketplace">
                  <Store className="h-4 w-4 text-primary" />
                  Open marketplace
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl gap-2 min-h-[44px] border-white/50 bg-white/15 text-white shadow-md shadow-black/20 hover:bg-white/25 hover:text-white focus-visible:ring-white/60"
                asChild
              >
                <Link href="/diaspora#intelligence">
                  <LineChart className="h-4 w-4 text-cyan-200" />
                  Today&apos;s Market
                </Link>
              </Button>
            </div>
            <div className="mt-7 pt-5 border-t border-white/20 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/85 font-medium">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> Secure checkout</span>
              <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Pay in USD</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" /> Verified vendors</span>
            </div>
          </div>
        </section>

        <MarketplacePanel />
        <IntelligencePanel />
        <InvestmentPanel />
        <RemittancePanel />
        <TrustPanel />
      </div>
    </DashboardShell>
  )
}
