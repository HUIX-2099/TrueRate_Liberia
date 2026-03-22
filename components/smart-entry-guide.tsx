"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  DollarSign,
  ShoppingBasket,
  Send,
  GraduationCap,
  Briefcase,
  Globe,
  Shield,
  TrendingUp,
} from "lucide-react"
import { useLiveRate } from "@/lib/live-rate-context"

const SITUATIONS = [
  { id: "exchange", icon: DollarSign, label: "I want to exchange money", sublabel: "Check if the rate is fair", color: "emerald", href: "/converter" },
  { id: "send", icon: Send, label: "I'm sending money home", sublabel: "Compare providers, save on fees", color: "blue", href: "/tools/remittance" },
  { id: "prices", icon: ShoppingBasket, label: "I want to check if prices are fair", sublabel: "Rice, fuel, rent & everyday goods", color: "amber", href: "/price-index" },
  { id: "budget", icon: TrendingUp, label: "I want to plan my budget", sublabel: "Monthly income & expenses in LRD", color: "purple", href: "/tools/budget" },
  { id: "student", icon: GraduationCap, label: "I'm a student planning costs", sublabel: "Tuition, transport & food", color: "cyan", href: "/tools/student-budget" },
  { id: "business", icon: Briefcase, label: "I run a business", sublabel: "Import costs & forex risk tools", color: "orange", href: "/business" },
  { id: "diaspora", icon: Globe, label: "I'm Liberian abroad", sublabel: "Send smarter, invest back home", color: "rose", href: "/diaspora" },
  { id: "fraud", icon: Shield, label: "I was cheated or quoted a bad rate", sublabel: "Report fraud, warn the community", color: "red", href: "/report-fraud" },
] as const

const COLORS: Record<string, { border: string; bg: string; hover: string; icon: string; arrow: string }> = {
  emerald: {
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/5",
    hover: "hover:bg-emerald-500/10 hover:border-emerald-500/40",
    icon: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    arrow: "text-emerald-600 dark:text-emerald-400",
  },
  blue: {
    border: "border-blue-500/25",
    bg: "bg-blue-500/5",
    hover: "hover:bg-blue-500/10 hover:border-blue-500/40",
    icon: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    arrow: "text-blue-600 dark:text-blue-400",
  },
  amber: {
    border: "border-amber-500/25",
    bg: "bg-amber-500/5",
    hover: "hover:bg-amber-500/10 hover:border-amber-500/40",
    icon: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    arrow: "text-amber-600 dark:text-amber-400",
  },
  purple: {
    border: "border-purple-500/25",
    bg: "bg-purple-500/5",
    hover: "hover:bg-purple-500/10 hover:border-purple-500/40",
    icon: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    arrow: "text-purple-600 dark:text-purple-400",
  },
  cyan: {
    border: "border-cyan-500/25",
    bg: "bg-cyan-500/5",
    hover: "hover:bg-cyan-500/10 hover:border-cyan-500/40",
    icon: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    arrow: "text-cyan-600 dark:text-cyan-400",
  },
  orange: {
    border: "border-orange-500/25",
    bg: "bg-orange-500/5",
    hover: "hover:bg-orange-500/10 hover:border-orange-500/40",
    icon: "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
    arrow: "text-orange-600 dark:text-orange-400",
  },
  rose: {
    border: "border-rose-500/25",
    bg: "bg-rose-500/5",
    hover: "hover:bg-rose-500/10 hover:border-rose-500/40",
    icon: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    arrow: "text-rose-600 dark:text-rose-400",
  },
  red: {
    border: "border-red-500/25",
    bg: "bg-red-500/5",
    hover: "hover:bg-red-500/10 hover:border-red-500/40",
    icon: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
    arrow: "text-red-600 dark:text-red-400",
  },
}

export function SmartEntryGuide() {
  const router = useRouter()
  const { effectiveRate, loading } = useLiveRate()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex flex-col items-center text-center gap-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          What do you need today?
        </p>
        <p className="text-[11px] text-muted-foreground">
          Live rate:{" "}
          <span className="font-semibold text-foreground">
            {loading ? "..." : `L$${effectiveRate.toFixed(2)} per USD`}
          </span>
          <span className="mx-2 opacity-40">·</span>
          Updates every 60 seconds
        </p>
      </div>

      {/* 8-button grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SITUATIONS.map((s) => {
          const c = COLORS[s.color]
          const Icon = s.icon
          const isSelected = selected === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSelected(s.id)
                setTimeout(() => router.push(s.href), 120)
              }}
              className={`group flex flex-col gap-2.5 rounded-xl border p-4 text-left transition-all duration-150 ${c.border} ${c.bg} ${c.hover} ${isSelected ? "scale-[0.97] opacity-80" : "hover:-translate-y-0.5"}`}
            >
              {/* Icon */}
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${c.icon}`}>
                <Icon className="h-4 w-4" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground leading-snug">
                  {s.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                  {s.sublabel}
                </p>
              </div>

              {/* Arrow */}
              <div className={`flex items-center gap-1 text-[10px] font-semibold ${c.arrow}`}>
                Open
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
