"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Store, LineChart, TrendingUp, ArrowRight, MapPin } from "lucide-react"

const QUICK_LINKS = [
  { href: "#marketplace", label: "Marketplace" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#investment", label: "Investment" },
  { href: "#remittance", label: "Remittance" },
  { href: "#trust", label: "Trust" },
] as const

export function DiasporaHero() {
  return (
    <section
      className="relative py-14 sm:py-16 md:py-24 overflow-x-hidden rounded-b-3xl dark:from-[#060a12] dark:via-[#0c121c] dark:to-[#060a12] border-b border-white/10 md:border-0"
      aria-labelledby="diaspora-hero-heading"
    >
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none md:hidden" aria-hidden />
      {/* Ambient gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(59,130,246,0.04),transparent)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <Badge className="bg-white/12 text-white/95 border-white/25 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-sm">
              For Liberians Abroad
            </Badge>
            <Badge className="bg-primary/25 text-primary-foreground border-primary/40 text-[10px] font-semibold uppercase tracking-widest">
              Premium
            </Badge>
            <Badge className="bg-emerald-500/25 text-emerald-300 border-emerald-500/40 text-[10px] font-semibold uppercase tracking-widest">
              Trusted Commerce
            </Badge>
          </div>
          <h1
            id="diaspora-hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display text-white text-balance mb-5 leading-[1.1]"
          >
            Navigate Home.
            <br />
            <span className="text-foreground bg-[length:200%_auto] animate-[shimmer_4s_ease-in-out_infinite]">
              From Anywhere.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/80 text-pretty max-w-2xl mx-auto mb-8 leading-relaxed">
            Empowering global Liberians with real-time market intelligence, trusted commerce,
            and investment transparency.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2 min-h-[var(--tap-target-min)] rounded-xl font-semibold"
            >
              <Link href="/diaspora/marketplace">
                <Store className="h-5 w-5 text-primary" />
                Enter Marketplace
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/35 text-white hover:bg-white/15 gap-2 min-h-[var(--tap-target-min)] rounded-xl backdrop-blur-sm"
            >
              <Link href="/market">
                <LineChart className="h-5 w-5 text-primary" />
                View Live Rates
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/35 text-white hover:bg-white/15 gap-2 min-h-[var(--tap-target-min)] rounded-xl backdrop-blur-sm"
            >
              <Link href="/invest">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                Track Investments
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-white/70">
            <MapPin className="h-4 w-4 shrink-0 hidden sm:block text-blue-600 dark:text-blue-400" aria-hidden />
            <span className="text-xs sm:text-sm font-medium">Jump to:</span>
            {QUICK_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-xs sm:text-sm px-2 py-1 rounded-md hover:bg-white/15 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
