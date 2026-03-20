"use client"

import Link from "next/link"
import { ArrowRight, Heart, Shield, DollarSign, Truck, CheckCircle2, Star } from "lucide-react"

export interface MarketplaceHeroProps {
  variant?: "default" | "compact"
}

const TRUST_ITEMS = [
  { icon: Shield, label: "Secure checkout" },
  { icon: DollarSign, label: "Pay in USD" },
  { icon: Truck, label: "Delivery to Liberia" },
]

export function MarketplaceHero({ variant = "default" }: MarketplaceHeroProps) {
  if (variant === "compact") {
    return (
      <div className="rounded-2xl border border-primary/20 p-5 sm:p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="h-4 w-4 text-primary" aria-hidden />
          <p className="text-sm font-semibold text-foreground">Send to family at home</p>
        </div>
        <p className="text-muted-foreground text-sm mb-4 max-w-md leading-relaxed">
          Shop in USD. Add your family&apos;s address at checkout. Verified vendors deliver in Liberia.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/diaspora/marketplace"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all min-h-[44px] shadow-sm"
          >
            Browse & send
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-muted-foreground">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1">
                <Icon className="h-3 w-3 text-primary" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl min-h-[240px] sm:min-h-[300px] px-6 sm:px-10 py-8 sm:py-12 flex flex-col justify-center mb-8 shadow-lg ring-1 ring-white/25 max-md:ring-2 max-md:ring-white/35 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div
        className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -right-16 top-1/3 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-white/5 blur-2xl pointer-events-none"
        aria-hidden
      />
      <div className="absolute inset-0 opacity-35 mix-blend-overlay pointer-events-none" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_40%,rgba(255,255,255,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.06),transparent_40%)]" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-white/95 rounded-full bg-white/15 px-3 py-1 border border-white/30">
            <Star className="h-3 w-3 text-amber-600 dark:text-amber-400" /> Diaspora marketplace
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-white/95 rounded-full bg-rose-400/20 px-3 py-1 border border-rose-300/35">
            <Heart className="h-3 w-3 text-rose-200" /> Support home goals
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-sm">
          Send what matters, right on time
        </h2>
        <p className="text-white/85 text-sm sm:text-base max-w-xl mb-7 leading-relaxed">
          From essentials to project supplies, shop trusted vendors with clear pricing and reliable delivery
          across Liberia.
        </p>
        <p className="text-xs sm:text-sm text-white/80 mb-6 max-w-xl">
          Designed for diaspora households, professionals, and organizations staying active back home.
        </p>
        <Link
          href="#products"
          className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-6 py-3.5 text-sm font-semibold hover:bg-white/95 hover:shadow-lg transition-all w-fit min-h-[48px] shadow-md"
        >
          Start shopping
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
      <div className="relative z-10 mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center gap-x-5 gap-y-2">
        {TRUST_ITEMS.map(({ icon: Icon, label }) => (
          <span key={label} className="flex items-center gap-2 text-xs font-medium text-white/90 bg-white/10 rounded-full px-3 py-1.5 border border-white/25">
            <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
            {label}
          </span>
        ))}
        <span className="flex items-center gap-2 text-xs font-medium text-white/95 bg-emerald-500/20 rounded-full px-3 py-1.5 border border-emerald-300/35">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-200" aria-hidden />
          Communities served daily
        </span>
      </div>
    </div>
  )
}
