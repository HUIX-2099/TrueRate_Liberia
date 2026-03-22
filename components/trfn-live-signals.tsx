"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"

interface Signal {
  headline: string
  impact: "High" | "Medium" | "Low"
  timeframe: string
  category: string
}

function impactColor(impact: string) {
  if (impact === "High") return "text-rose-700 dark:text-rose-300 border-rose-500/30 bg-rose-500/10"
  if (impact === "Medium") return "text-amber-700 dark:text-amber-300 border-amber-500/30 bg-amber-500/10"
  return "text-emerald-700 dark:text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
}

function normalizeSignals(raw: unknown): Signal[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  const out: Signal[] = []
  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const o = item as Record<string, unknown>
    if (typeof o.headline !== "string" || !o.headline.trim()) continue
    const impact = o.impact === "High" || o.impact === "Medium" || o.impact === "Low" ? o.impact : "Medium"
    const timeframe = typeof o.timeframe === "string" ? o.timeframe : ""
    const category = typeof o.category === "string" ? o.category : ""
    out.push({ headline: o.headline, impact, timeframe, category })
  }
  return out.length > 0 ? out : null
}

export function TrfnLiveSignals() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)
  const [generatedAt, setGeneratedAt] = useState<string>("")
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    const ac = new AbortController()
    fetch("/api/trfn/signals", { signal: ac.signal })
      .then((r) => r.json())
      .then((data: { signals?: unknown; generatedAt?: string; fallback?: boolean }) => {
        const next = normalizeSignals(data.signals)
        if (next) {
          setSignals(next)
          setGeneratedAt(typeof data.generatedAt === "string" ? data.generatedAt : "")
          setIsFallback(data.fallback === true)
        }
      })
      .catch(() => {
        // Network / parse error — signals stay empty (server fallback is in JSON when reachable)
      })
      .finally(() => setLoading(false))
    return () => ac.abort()
  }, [])

  return (
    <div className="space-y-3">
      {/* Header with live indicator */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {loading ? (
            <RefreshCw className="h-3 w-3 animate-spin text-cyan-600 dark:text-cyan-400" />
          ) : signals.length === 0 ? (
            <span className="h-2 w-2 rounded-full bg-muted-foreground/35" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {loading
              ? "Generating signals..."
              : signals.length === 0
                ? "Signals unavailable"
                : isFallback
                  ? "TRFN Signals"
                  : "AI-Generated · Live"}
          </span>
        </div>
        {generatedAt && !loading && (
          <span className="text-[10px] text-muted-foreground">
            {new Date(generatedAt).toLocaleTimeString("en-LR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>

      {!loading && signals.length === 0 ? (
        <p className="text-sm text-muted-foreground rounded-lg border border-dashed border-border/60 px-4 py-6 text-center leading-relaxed">
          Economic outlook signals couldn&apos;t load.{" "}
          <Link href="/trfn-dashboard" className="text-primary font-medium underline-offset-2 hover:underline">
            Open TRFN dashboard
          </Link>
        </p>
      ) : (
        signals.map((signal, i) => (
          <Link
            key={`${signal.headline}-${i}`}
            href="/trfn-dashboard"
            className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card/80 px-4 py-3.5 text-sm hover:border-border hover:bg-card transition-all duration-150 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground leading-snug line-clamp-2">
                {signal.headline}
              </p>
              {signal.category && (
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                  {signal.category}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <Badge className={`text-[10px] border ${impactColor(signal.impact)}`}>
                {signal.impact}
              </Badge>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {signal.timeframe}
              </span>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
