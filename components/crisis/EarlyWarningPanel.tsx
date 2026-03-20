"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Radio } from "lucide-react"
import type { WarningSignal, WarningPrediction } from "@/lib/crisis/early-warning"

const STATUS_STYLES = {
  normal: { bg: "bg-muted/40 border border-border/40", text: "text-green-700 dark:text-green-400", border: "border-green-500/20", label: "Normal" },
  watch: { bg: "bg-muted/40 border border-border/40", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-500/20", label: "Watch" },
  warning: { bg: "bg-muted/40 border border-border/40", text: "text-orange-700 dark:text-orange-400", border: "border-orange-500/20", label: "Warning" },
  alert: { bg: "bg-muted/40 border border-border/40", text: "text-red-700 dark:text-red-400", border: "border-red-500/20", label: "Alert" },
}

interface EarlyWarningPanelProps {
  signals: WarningSignal[]
  predictions: WarningPrediction[]
  overallRisk: "low" | "moderate" | "high" | "critical"
  riskScore: number
}

export function EarlyWarningPanel({ signals, predictions, overallRisk, riskScore }: EarlyWarningPanelProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border/40 rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 animate-pulse text-primary" />
            <CardTitle className="text-lg">Early Warning Signals</CardTitle>
            <Badge
              variant="outline"
              className={`ml-auto ${ overallRisk === "critical" ? "border-red-500 text-red-600" : overallRisk === "high" ? "border-orange-500 text-orange-600" : overallRisk === "moderate" ? "border-yellow-500 text-yellow-600" : "border-green-500 text-green-600" }`}
            >
              Risk: {overallRisk.charAt(0).toUpperCase() + overallRisk.slice(1)} ({riskScore}/100)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {signals.map((signal) => {
            const styles = STATUS_STYLES[signal.status]
            return (
              <div
                key={signal.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${styles.bg} border ${styles.border}`}
              >
                <div className="shrink-0">
                  {signal.status === "alert" ? (
                    <AlertTriangle className={`h-5 w-5 ${styles.text}`} />
                  ) : signal.changePercent > 0 ? (
                    <TrendingUp className={`h-5 w-5 ${styles.text}`} />
                  ) : signal.changePercent < 0 ? (
                    <TrendingDown className={`h-5 w-5 ${styles.text}`} />
                  ) : (
                    <Minus className={`h-5 w-5 ${styles.text}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{signal.name}</span>
                    <Badge variant="outline" className={`text-[10px] ${styles.text} ${styles.border}`}>
                      {styles.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{signal.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-bold text-sm ${styles.text}`}>
                    {signal.changePercent > 0 ? "+" : ""}{signal.changePercent.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-muted-foreground">{signal.changePeriod}</div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {predictions.length > 0 && (
        <Card className="border-border/40 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Price Predictions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {predictions.map((pred, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="shrink-0">
                  {pred.direction === "up" ? (
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : pred.direction === "down" ? (
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <Minus className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{pred.commodity}</div>
                  <p className="text-xs text-muted-foreground">
                    {pred.drivers.join(" + ")} — within {pred.timeframe}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-bold text-sm ${pred.direction === "up" ? "text-destructive" : pred.direction === "down" ? "text-green-600" : "text-muted-foreground"}`}>
                    {pred.direction === "up" ? "+" : pred.direction === "down" ? "" : "~"}{pred.estimatedChangePercent}%
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {Math.round(pred.confidence * 100)}% confidence
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
