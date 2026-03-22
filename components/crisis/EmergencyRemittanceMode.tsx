"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Zap, Clock, DollarSign, ArrowRight, CheckCircle2, Smartphone } from "lucide-react"
import { Fragment, useState } from "react"
import { RemittanceImpactSummary } from "@/components/remittance-impact-summary"

interface QuickSendOption {
  amount: number
  label: string
  receivesLRD: number
}

interface EmergencyRemittanceModeProps {
  currentRate: number
  crisisActive?: boolean
}

const FAST_PROVIDERS = [
  {
    name: "Orange Money",
    speed: "Instant",
    fee: 3.0,
    rateSpread: -1.2,
    bestFor: "Fastest + cheapest for small amounts",
    recommended: true,
  },
  {
    name: "Lonestar Mobile Money",
    speed: "Instant",
    fee: 3.5,
    rateSpread: -1.5,
    bestFor: "Wide agent network in rural areas",
    recommended: true,
  },
  {
    name: "Western Union",
    speed: "Minutes",
    fee: 8.0,
    rateSpread: -2.5,
    bestFor: "Cash pickup anywhere in Monrovia",
    recommended: false,
  },
  {
    name: "MoneyGram",
    speed: "Minutes",
    fee: 6.5,
    rateSpread: -2.0,
    bestFor: "Good balance of speed and rate",
    recommended: false,
  },
]

export function EmergencyRemittanceMode({ currentRate, crisisActive = true }: EmergencyRemittanceModeProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const quickSendOptions: QuickSendOption[] = [
    { amount: 25, label: "$25", receivesLRD: Math.round(25 * currentRate) },
    { amount: 50, label: "$50", receivesLRD: Math.round(50 * currentRate) },
    { amount: 100, label: "$100", receivesLRD: Math.round(100 * currentRate) },
    { amount: 200, label: "$200", receivesLRD: Math.round(200 * currentRate) },
  ]

  return (
    <div className="space-y-4">
      {crisisActive && (
        <Card className="border-red-500/20 bg-red-500/5 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="font-bold text-red-600 dark:text-red-400 mb-1">Economic Crisis Active in Liberia</h3>
                <p className="text-sm text-muted-foreground">
                  Fuel prices have risen significantly, driving up costs for food, transport, and essentials.
                  Your family may need urgent financial support. Here are the fastest ways to send money right now.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Send Presets */}
      <Card className="border-border/40 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Emergency Send
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickSendOptions.map((option) => (
              <button
                key={option.amount}
                onClick={() => setSelectedAmount(option.amount)}
                className={`p-4 rounded-xl border text-center transition-all ${ selectedAmount === option.amount ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border/40 hover:border-primary/50" }`}
              >
                <div className="text-2xl font-bold">{option.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  ≈ {option.receivesLRD.toLocaleString()} LRD
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fastest Providers */}
      <Card className="border-border/40 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Fastest Transfer Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {FAST_PROVIDERS.map((provider) => {
            const effectiveRate = currentRate + provider.rateSpread
            const receives = selectedAmount
              ? Math.round(selectedAmount * effectiveRate)
              : Math.round(100 * effectiveRate)
            const totalCost = (selectedAmount ?? 100) + provider.fee

            return (
              <Fragment key={provider.name}>
                <div
                  className={`p-4 rounded-xl border ${ provider.recommended ? "border-green-500/20 bg-green-500/5" : "border-border/40" }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{provider.name}</span>
                        {provider.recommended && (
                          <Badge variant="secondary" className="text-[10px] gap-0.5">
                            <Zap className="h-2.5 w-2.5 text-primary" /> Fastest
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{provider.bestFor}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{receives.toLocaleString()} LRD</div>
                      <div className="text-xs text-muted-foreground">recipient gets</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <div className="text-muted-foreground">Speed</div>
                      <div className="font-semibold flex items-center gap-1">
                        <Zap className="h-3 w-3 text-primary" /> {provider.speed}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <div className="text-muted-foreground">Fee</div>
                      <div className="font-semibold">${provider.fee.toFixed(2)}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <div className="text-muted-foreground">Total cost</div>
                      <div className="font-semibold">${totalCost.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                {provider.name === "Orange Money" && selectedAmount != null && (
                  <RemittanceImpactSummary
                    lrdReceived={Math.round((selectedAmount - 3) * currentRate)}
                    providerName="Orange Money"
                    amountUSD={selectedAmount}
                  />
                )}
              </Fragment>
            )
          })}
        </CardContent>
      </Card>

      {/* What the money can buy */}
      {selectedAmount && (
        <Card className="border-blue-500/20 bg-blue-500/5 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              What ${selectedAmount} Can Cover Right Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {getCoverageItems(selectedAmount, currentRate).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getCoverageItems(amountUSD: number, rate: number): string[] {
  const lrd = amountUSD * rate
  const items: string[] = []

  if (lrd >= 4500) items.push(`${Math.floor(lrd / 4500)} bag(s) of rice (25kg)`)
  if (lrd >= 900) items.push(`${Math.floor(lrd / 900)} gallon(s) of fuel`)
  if (lrd >= 150) items.push(`${Math.floor(lrd / 150)} taxi trips`)

  const daysOfFood = Math.floor(lrd / 600)
  if (daysOfFood > 0) items.push(`~${daysOfFood} days of basic food for a family of 4`)

  if (amountUSD >= 100) items.push("1 month of essential household expenses (basic)")
  if (amountUSD >= 200) items.push("Emergency fund buffer for 2-3 weeks")

  return items.slice(0, 5)
}
