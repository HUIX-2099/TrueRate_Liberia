"use client"

import Link from "next/link"

const LIBERIA_COSTS = [
  { item: "bags of rice (25kg)", costLRD: 4500, emoji: "🌾" },
  { item: "gallons of fuel", costLRD: 900, emoji: "⛽" },
  { item: "days of family meals", costLRD: 600, emoji: "🍽️" },
  { item: "taxi rides across Monrovia", costLRD: 150, emoji: "🚖" },
  { item: "phone top-ups (L$250)", costLRD: 250, emoji: "📱" },
  { item: "days of school transport", costLRD: 100, emoji: "🎒" },
  { item: "doctor visits", costLRD: 3000, emoji: "🏥" },
  { item: "months of water supply", costLRD: 1500, emoji: "💧" },
] as const

interface Props {
  lrdReceived: number
  providerName?: string
  amountUSD?: number
}

export function RemittanceImpactSummary({ lrdReceived, providerName, amountUSD }: Props) {
  if (!lrdReceived || lrdReceived < 500) return null

  const items = LIBERIA_COSTS.map((c) => ({ ...c, count: Math.floor(lrdReceived / c.costLRD) }))
    .filter((c) => c.count > 0)
    .slice(0, 4)

  if (items.length === 0) return null

  return (
    <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-3">
        {`✅ What L$${lrdReceived.toLocaleString()} covers for your family`}
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item) => (
          <div key={item.item} className="flex items-center gap-2">
            <span className="text-base leading-none" aria-hidden>
              {item.emoji}
            </span>
            <span className="text-xs text-foreground leading-snug">
              <strong className="text-emerald-700 dark:text-emerald-300">{item.count}</strong> {item.item}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
        {providerName && <span>Via {providerName}</span>}
        {amountUSD != null && amountUSD > 0 && (
          <span>You send ${amountUSD.toLocaleString()}</span>
        )}
        <span>Based on current Monrovia market prices</span>
        <Link href="/price-index" className="text-emerald-600 dark:text-emerald-400 hover:underline">
          Check prices →
        </Link>
      </div>
    </div>
  )
}
