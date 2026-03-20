"use client"

import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { ArrowRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const MOCK_PROVIDERS = [
  { id: "1", name: "Provider A", fxSpread: "1.2%", feeFixed: 2.99, feePct: 0, estDelivery: "1–2 days", bestRate: true },
  { id: "2", name: "Provider B", fxSpread: "1.5%", feeFixed: 0, feePct: 1.5, estDelivery: "2–3 days", bestRate: false },
  { id: "3", name: "Provider C", fxSpread: "1.8%", feeFixed: 4.99, feePct: 0, estDelivery: "1 day", bestRate: false },
]

export function TransferComparison() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Flow: USD → Fees → FX → LRD</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
        <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1">USD amount</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1">Fees</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1">FX rate</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1">LRD received</span>
      </div>
      <ul className="space-y-3">
        {MOCK_PROVIDERS.map((p) => (
          <li key={p.id}>
            <Card className={cn("border-border/60", p.bestRate && "border-primary/30 ring-1 ring-primary/10")}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-sm flex items-center gap-2">
                      {p.name}
                      {p.bestRate && (
                        <StatusBadge label="Best rate" variant="positive" size="sm" />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Spread {p.fxSpread} · Fee {p.feeFixed > 0 ? `$${p.feeFixed}` : `${p.feePct}%`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
                  {p.estDelivery}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
