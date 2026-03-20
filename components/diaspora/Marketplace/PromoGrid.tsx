"use client"

import Link from "next/link"
import { Package, UtensilsCrossed, Fuel } from "lucide-react"

const PROMOS = [
  {
    href: "/diaspora/marketplace",
    label: "Construction & materials",
    sub: "Cement, zinc, tiles, rebar",
    icon: Package,
    gradient: "from-blue-500 via-blue-600 to-indigo-700",
  },
  {
    href: "/diaspora/marketplace",
    label: "Food & groceries",
    sub: "Rice, oil, canned goods",
    icon: UtensilsCrossed,
    gradient: "from-violet-500 via-purple-600 to-fuchsia-600",
  },
  {
    href: "/diaspora/marketplace",
    label: "Fuel vouchers",
    sub: "Gasoline & diesel",
    icon: Fuel,
    gradient: "from-slate-600 via-slate-700 to-indigo-800",
  },
]

export function PromoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
      {PROMOS.map((promo) => {
        const Icon = promo.icon
        return (
          <Link
            key={promo.label}
            href={promo.href}
            className={`relative overflow-hidden rounded-2xl min-h-[140px] ${promo.gradient} p-6 flex flex-col justify-end group`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_30%,rgba(255,255,255,0.12),transparent)]" />
            <Icon className="absolute top-4 right-4 h-10 w-10 text-white/30 text-primary" aria-hidden />
            <p className="font-semibold text-white text-sm relative z-10">{promo.label}</p>
            <p className="text-white/80 text-xs mt-0.5 relative z-10">{promo.sub}</p>
          </Link>
        )
      })}
    </div>
  )
}
