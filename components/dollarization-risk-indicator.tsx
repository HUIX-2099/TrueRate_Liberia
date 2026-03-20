"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  TrendingUp,
  TrendingDown,
  Droplets,
  Activity,
  RefreshCw,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DollarizationRiskData {
  usdDemandPressure: number
  lrdWeakeningTrend: number
  marketLiquidityRisk: number
  period: string
  computedAt: string
}

function riskLevel(score: number): "low" | "moderate" | "elevated" | "high" {
  if (score >= 70) return "high"
  if (score >= 50) return "elevated"
  if (score >= 30) return "moderate"
  return "low"
}

function riskColor(score: number): string {
  const level = riskLevel(score)
  switch (level) {
    case "high":
      return "bg-red-500"
    case "elevated":
      return "bg-amber-500"
    case "moderate":
      return "bg-emerald-500/80"
    default:
      return "bg-emerald-400"
  }
}

function riskLabel(score: number): string {
  const level = riskLevel(score)
  switch (level) {
    case "high":
      return "High"
    case "elevated":
      return "Elevated"
    case "moderate":
      return "Moderate"
    default:
      return "Low"
  }
}

function healthLevel(score: number): "strong" | "moderate" | "weakening" | "at-risk" {
  if (score >= 70) return "strong"
  if (score >= 50) return "moderate"
  if (score >= 30) return "weakening"
  return "at-risk"
}

function healthColor(score: number): string {
  const level = healthLevel(score)
  switch (level) {
    case "strong":
      return "bg-emerald-500/90"
    case "moderate":
      return "bg-amber-500/90"
    case "weakening":
      return "bg-orange-500/90"
    default:
      return "bg-red-500/90"
  }
}

function healthLabel(score: number): string {
  const level = healthLevel(score)
  switch (level) {
    case "strong":
      return "Strong"
    case "moderate":
      return "Moderate"
    case "weakening":
      return "Weakening"
    default:
      return "At risk"
  }
}

function healthCaption(score: number): string {
  const level = healthLevel(score)
  switch (level) {
    case "strong":
      return "Higher LRD stability: USD preference and liquidity stress look manageable."
    case "moderate":
      return "Some pressure: keep an eye on USD preference and the LRD trend."
    case "weakening":
      return "Weakening period: USD demand is building and the LRD trend is unfavorable."
    default:
      return "High pressure: liquidity stress and USD preference are elevated."
  }
}

/** Single horizontal gauge 0–100 with label and caption. */
function RiskMeter({
  value,
  label,
  caption,
  icon: Icon,
  variant = "default",
}: {
  value: number
  label: string
  caption: string
  icon: React.ElementType
  variant?: "default" | "dark"
}) {
  const fillColor = riskColor(value)
  const labelText = riskLabel(value)
  const isDark = variant === "dark"

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon
            className={cn(
              "h-4 w-4 shrink-0",
              isDark ? "text-white/70" : "text-muted-foreground"
            )}
            aria-hidden
          />
          <span
            className={cn(
              "text-xs font-medium truncate",
              isDark ? "text-white/90" : "text-foreground"
            )}
          >
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              "text-sm font-mono font-semibold tabular-nums",
              isDark ? "text-white" : "text-foreground"
            )}
          >
            {value}
          </span>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-medium border-0",
              value >= 70 && "bg-red-500/20 text-red-400",
              value >= 50 && value < 70 && "bg-amber-500/20 text-amber-400",
              value >= 30 && value < 50 && "bg-emerald-500/20 text-emerald-400",
              value < 30 && "bg-muted/40 border border-border/40 text-emerald-300"
            )}
          >
            {labelText}
          </Badge>
        </div>
      </div>
      <div className="relative h-2 rounded-full overflow-hidden bg-black/20 dark:bg-white/10">
        <div
          className={cn("h-full rounded-full transition-all duration-500", fillColor)}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${value}%`}
        />
      </div>
      {caption && (
        <p
          className={cn(
            "text-[11px] leading-tight",
            isDark ? "text-white/60" : "text-muted-foreground"
          )}
        >
          {caption}
        </p>
      )}
    </div>
  )
}

export function DollarizationRiskIndicator({
  className,
  variant = "default",
  compact = false,
}: {
  className?: string
  variant?: "default" | "dark"
  compact?: boolean
}) {
  const [data, setData] = useState<DollarizationRiskData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/dollarization-risk")
      if (!res.ok) throw new Error("Failed to load")
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load risk data")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const isDark = variant === "dark"

  if (loading && !data) {
    return (
      <Card
        className={cn(
          "overflow-hidden",
          isDark && "bg-white/5 border-white/10",
          className
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className={cn("text-sm font-semibold flex items-center gap-2", isDark && "text-white")}>
            <BarChart3 className="h-4 w-4 text-primary" />
            LRD health
          </CardTitle>
          <CardDescription className={isDark ? "text-white/60" : undefined}>
            Higher = stronger LRD stability (live).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
        </CardContent>
      </Card>
    )
  }

  if (error && !data) {
    return (
      <Card className={cn("overflow-hidden", isDark && "bg-white/5 border-white/10", className)}>
        <CardContent className="py-6">
          <p className={cn("text-sm", isDark ? "text-white/70" : "text-muted-foreground")}>{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            Retry
          </button>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card
      className={cn(
        "overflow-hidden",
        isDark && "bg-white/5 border-white/10",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Activity className={cn("h-4 w-4", isDark ? "text-primary-400" : "text-primary")} />
            <CardTitle className={cn("text-sm font-semibold", isDark && "text-white")}>
              LRD health
            </CardTitle>
          </div>
          {!compact && (
            <span className={cn("text-[10px] uppercase tracking-wider", isDark ? "text-white/50" : "text-muted-foreground")}>
              {data.period}
            </span>
          )}
        </div>
        <CardDescription className={isDark ? "text-white/60" : undefined}>
          Higher = stronger LRD stability. Based on USD preference, LRD trend, and liquidity stress.
        </CardDescription>
      </CardHeader>
      {(() => {
        // Convert 3 "pressure" meters (0–100 each) into a single "health" score (0–100; higher is better).
        const pressureScore = Math.round(0.4 * data.usdDemandPressure + 0.4 * data.lrdWeakeningTrend + 0.2 * data.marketLiquidityRisk)
        const lrdHealthScore = Math.max(0, Math.min(100, 100 - pressureScore))

        return (
          <CardContent className={cn("space-y-4", compact && "space-y-3")}>
            <div className={cn("rounded-lg border border-border/50 bg-muted/20 dark:bg-white/5 p-4", variant === "dark" && "bg-white/5")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">LRD health score</div>
                  <div className={cn("text-2xl font-bold tabular-nums", isDark ? "text-white" : "text-foreground")}>
                    {lrdHealthScore}
                    <span className="text-xs font-medium text-muted-foreground ml-1">/100</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-medium border-0",
                        healthLevel(lrdHealthScore) === "strong" && "bg-emerald-500/20 text-emerald-400",
                        healthLevel(lrdHealthScore) === "moderate" && "bg-amber-500/20 text-amber-400",
                        healthLevel(lrdHealthScore) === "weakening" && "bg-orange-500/20 text-orange-400",
                        healthLevel(lrdHealthScore) === "at-risk" && "bg-red-500/20 text-red-400"
                      )}
                    >
                      {healthLabel(lrdHealthScore)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground leading-snug">{healthCaption(lrdHealthScore)}</div>
                </div>
              </div>

              <div className="mt-3 relative h-2 rounded-full overflow-hidden bg-black/20 dark:bg-white/10">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", healthColor(lrdHealthScore))}
                  style={{ width: `${Math.max(0, Math.min(100, lrdHealthScore))}%` }}
                  role="progressbar"
                  aria-valuenow={lrdHealthScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`LRD health: ${lrdHealthScore} out of 100`}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-muted/40 text-muted-foreground">
                  USD preference: {riskLabel(data.usdDemandPressure)}
                </Badge>
                <Badge variant="secondary" className="bg-muted/40 text-muted-foreground">
                  LRD trend: {riskLabel(data.lrdWeakeningTrend)}
                </Badge>
                <Badge variant="secondary" className="bg-muted/40 text-muted-foreground">
                  Liquidity stress: {riskLabel(data.marketLiquidityRisk)}
                </Badge>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="drivers">
                <AccordionTrigger className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What drives this score
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-3 space-y-4">
                    <RiskMeter
                      value={data.usdDemandPressure}
                      label="USD demand pressure"
                      caption="Higher = stronger preference for USD over LRD in the market."
                      icon={TrendingUp}
                      variant={variant}
                    />
                    <RiskMeter
                      value={data.lrdWeakeningTrend}
                      label="LRD weakening trend"
                      caption="Higher = LRD losing value vs USD (rate trending up)."
                      icon={TrendingDown}
                      variant={variant}
                    />
                    <RiskMeter
                      value={data.marketLiquidityRisk}
                      label="Market liquidity risk"
                      caption="Higher = wider spreads, more volatility, thinner liquidity."
                      icon={Droplets}
                      variant={variant}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        )
      })()}
    </Card>
  )
}
