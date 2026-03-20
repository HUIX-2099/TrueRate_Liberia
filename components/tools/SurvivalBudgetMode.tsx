"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowDown, ArrowRight, CheckCircle2, Scissors, TrendingUp } from "lucide-react"
import { SUBSTITUTIONS } from "@/lib/crisis/substitutions"
import { useMemo } from "react"

interface BudgetItem {
  id: string
  name: string
  amount: number
  currency: string
  category: string
}

interface SurvivalBudgetModeProps {
  expenses: BudgetItem[]
  exchangeRate: number
  fuelHikePercent?: number
  onApplySuggestion?: (id: string, newAmount: number) => void
}

interface ExpenseImpact {
  item: BudgetItem
  increasePercent: number
  newAmount: number
  extraCost: number
  canSubstitute: boolean
  substitutionSavings?: number
  substitutionName?: string
}

const CATEGORY_FUEL_SENSITIVITY: Record<string, number> = {
  transport: 0.70,
  food: 0.35,
  housing: 0.05,
  utilities: 0.50,
  education: 0.10,
  health: 0.15,
  entertainment: 0.05,
  other: 0.15,
}

export function SurvivalBudgetMode({
  expenses,
  exchangeRate,
  fuelHikePercent = 22,
  onApplySuggestion,
}: SurvivalBudgetModeProps) {
  const analysis = useMemo(() => {
    const impacts: ExpenseImpact[] = expenses.map((item) => {
      const sensitivity = CATEGORY_FUEL_SENSITIVITY[item.category] ?? 0.15
      const increasePercent = fuelHikePercent * sensitivity
      const amountUSD = item.currency === "USD" ? item.amount : item.amount / exchangeRate
      const extraCostUSD = amountUSD * (increasePercent / 100)
      const newAmountUSD = amountUSD + extraCostUSD

      const sub = findSubstitution(item.name, item.category)
      const substitutionSavings = sub
        ? amountUSD * (sub.savingsPercent / 100)
        : undefined

      return {
        item,
        increasePercent: Number(increasePercent.toFixed(1)),
        newAmount: Number(newAmountUSD.toFixed(2)),
        extraCost: Number(extraCostUSD.toFixed(2)),
        canSubstitute: !!sub,
        substitutionSavings: substitutionSavings ? Number(substitutionSavings.toFixed(2)) : undefined,
        substitutionName: sub?.name,
      }
    })

    impacts.sort((a, b) => b.extraCost - a.extraCost)

    const totalExtraCostUSD = impacts.reduce((s, i) => s + i.extraCost, 0)
    const totalPossibleSavings = impacts
      .filter((i) => i.substitutionSavings)
      .reduce((s, i) => s + (i.substitutionSavings ?? 0), 0)

    const minimumBudget = impacts.reduce((s, i) => {
      if (["entertainment", "other"].includes(i.item.category)) return s
      return s + i.newAmount
    }, 0)

    return { impacts, totalExtraCostUSD, totalPossibleSavings, minimumBudget }
  }, [expenses, exchangeRate, fuelHikePercent])

  return (
    <div className="space-y-4">
      <Card className="border-orange-500/20 bg-orange-500/5 rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-base text-orange-700 dark:text-orange-400">Survival Budget Mode</CardTitle>
            <Badge variant="outline" className="ml-auto border-orange-500/30 text-orange-600 text-xs">
              Fuel +{fuelHikePercent}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-destructive">
                +${analysis.totalExtraCostUSD.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Extra cost/mo</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                -${analysis.totalPossibleSavings.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Possible savings</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                ${analysis.minimumBudget.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Min. survival</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            Expenses Most Affected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {analysis.impacts.slice(0, 8).map((impact) => (
            <div key={impact.item.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 text-sm">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{impact.item.name}</div>
                <div className="text-xs text-muted-foreground">{impact.item.category}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-destructive font-semibold text-xs">
                  +{impact.increasePercent}% (+${impact.extraCost})
                </div>
              </div>
              {impact.canSubstitute && (
                <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-600 shrink-0">
                  <Scissors className="h-2.5 w-2.5 mr-0.5 text-primary" />
                  Save ${impact.substitutionSavings}
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {analysis.impacts.some((i) => i.canSubstitute) && (
        <Card className="border-green-500/20 bg-green-500/5 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              Recommended Substitutions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.impacts
              .filter((i) => i.canSubstitute)
              .map((impact) => (
                <div key={impact.item.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-green-500/5 text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground line-through text-xs">{impact.item.name}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium text-green-700 dark:text-green-400 text-xs">{impact.substitutionName}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    Save ${impact.substitutionSavings}/mo
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function findSubstitution(itemName: string, category: string): { name: string; savingsPercent: number } | null {
  const lower = itemName.toLowerCase()
  for (const sub of SUBSTITUTIONS) {
    if (lower.includes(sub.id) || lower.includes(sub.primary.name.toLowerCase().split(" ")[0])) {
      if (sub.alternatives.length > 0) {
        return { name: sub.alternatives[0].name, savingsPercent: sub.alternatives[0].savingsPercent }
      }
    }
  }
  if (category === "transport") return { name: "Kekeh / walking", savingsPercent: 40 }
  if (category === "food" && lower.includes("rice")) return { name: "Local rice / cassava", savingsPercent: 30 }
  return null
}
