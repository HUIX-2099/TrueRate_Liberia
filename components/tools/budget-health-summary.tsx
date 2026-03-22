"use client"

import Link from "next/link"

interface BudgetHealthCpi {
  inflationYoY?: number
}

export function BudgetHealthSummary({
  totalIncome,
  totalExpenses,
  effectiveRate,
  cpi,
}: {
  totalIncome: number
  totalExpenses: number
  effectiveRate: number
  cpi?: BudgetHealthCpi | null
}) {
  if (totalIncome <= 0) return null
  if (!Number.isFinite(effectiveRate) || effectiveRate <= 0) return null

  const balanceUSD = totalIncome - totalExpenses
  const savingsRate = (balanceUSD / totalIncome) * 100
  const balanceLRD = Math.abs(balanceUSD) * effectiveRate

  const cfg =
    savingsRate >= 20
      ? {
          emoji: "✅",
          label: "Healthy budget",
          cls: "border-emerald-500/30 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200",
          tip: `You're saving ${savingsRate.toFixed(0)}% of income — L$${(balanceUSD * effectiveRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} left every month. Good buffer if the rate shifts.`,
        }
      : savingsRate >= 5
        ? {
            emoji: "⚠️",
            label: "Tight but manageable",
            cls: "border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-200",
            tip: `${savingsRate.toFixed(0)}% savings margin. One rate shift could tighten this. Try cutting transport or food costs by 10%.`,
          }
        : savingsRate >= 0
          ? {
              emoji: "🔶",
              label: "Very tight budget",
              cls: "border-orange-500/30 bg-orange-500/5 text-orange-800 dark:text-orange-200",
              tip: `L$${balanceLRD.toLocaleString(undefined, { maximumFractionDigits: 0 })} remaining. Look for one expense to reduce — even L$500/month adds up.`,
            }
          : {
              emoji: "🚨",
              label: "Over budget",
              cls: "border-rose-500/30 bg-rose-500/5 text-rose-800 dark:text-rose-200",
              tip: `Spending L$${balanceLRD.toLocaleString(undefined, { maximumFractionDigits: 0 })} more than you earn. Review your biggest expense — usually rent or food.`,
            }

  return (
    <div className={`mt-4 rounded-xl border p-4 ${cfg.cls}`}>
      <p className="text-sm font-semibold mb-1">
        {cfg.emoji} {cfg.label}
      </p>
      <p className="text-xs leading-relaxed opacity-90">{cfg.tip}</p>
      <div className="mt-3 pt-2 border-t border-current/10 flex flex-wrap gap-3 text-[10px] opacity-70">
        <span>Rate today: L${effectiveRate.toFixed(2)}/USD</span>
        {cpi?.inflationYoY != null && <span>Inflation: {cpi.inflationYoY}% YoY</span>}
        <Link href="/price-index" className="underline hover:opacity-80">
          Check market prices →
        </Link>
        <Link href="/tools/remittance" className="underline hover:opacity-80">
          Send money home →
        </Link>
      </div>
    </div>
  )
}
