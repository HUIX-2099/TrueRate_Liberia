"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Trash2, Plus, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLiveRate } from "@/lib/live-rate-context"

function getOrCreateClientId(): string {
  if (typeof window === "undefined") return "anonymous"
  let id = localStorage.getItem("truerate-client-id")
  if (!id) {
    id = "cl-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
    localStorage.setItem("truerate-client-id", id)
  }
  return id
}

interface RateAlertRow {
  id: string
  target_rate?: number
  direction?: string
  active?: boolean
  triggered?: boolean
}

export function RateAlertSetter() {
  const { effectiveRate, loading: rateLoading } = useLiveRate()
  const [alerts, setAlerts] = useState<RateAlertRow[]>([])
  const [targetRate, setTargetRate] = useState("")
  const [direction, setDirection] = useState<"above" | "below">("above")
  const [email, setEmail] = useState("")
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [clientId, setClientId] = useState("anonymous")

  useEffect(() => {
    const id = getOrCreateClientId()
    setClientId(id)
    const q = encodeURIComponent(id)
    fetch(`/api/rates/alerts?clientId=${q}`)
      .then((r) => r.json())
      .then((data) => setAlerts(data.alerts ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (rateLoading || !effectiveRate || targetRate) return
    if (effectiveRate < 100 || effectiveRate > 300) return
    const suggestion =
      direction === "above" ? (effectiveRate + 2).toFixed(0) : (effectiveRate - 2).toFixed(0)
    setTargetRate(suggestion)
  }, [rateLoading, effectiveRate, direction, targetRate])

  const handleAdd = async () => {
    const rate = parseFloat(targetRate)
    if (!rate || rate < 100 || rate > 300) return
    setSaving(true)
    setSavedMessage(null)
    try {
      const res = await fetch("/api/rates/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRate: rate,
          direction,
          email: email.trim() || undefined,
          clientId,
        }),
      })
      const data = (await res.json()) as { ok?: boolean; id?: string; message?: string; error?: string }
      if (res.ok && data.ok && data.id) {
        setAlerts((prev) => [
          ...prev,
          { id: data.id!, target_rate: rate, direction, active: true, triggered: false },
        ])
        setSavedMessage(
          data.message ??
            `Alert set! We'll notify you when the rate goes ${direction} L$${rate.toFixed(2)}.`,
        )
        setTimeout(() => setSavedMessage(null), 4000)
        setTargetRate("")
        setEmail("")
      }
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/rates/alerts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.ok) setAlerts((prev) => prev.filter((a) => a.id !== id))
    } catch {
      // ignore
    }
  }

  const rateLabel =
    rateLoading || !Number.isFinite(effectiveRate) ? "..." : `L$${effectiveRate.toFixed(2)}`

  return (
    <div className="rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Bell className="h-4 w-4 text-amber-600 dark:text-amber-300" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Rate Alerts</p>
            <p className="text-[10px] text-muted-foreground">Current: {rateLabel}</p>
          </div>
        </div>
        {alerts.filter((a) => !a.triggered).length > 0 && (
          <Badge className="border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 text-[10px]">
            {alerts.filter((a) => !a.triggered).length} active
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDirection("above")}
            className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
              direction === "above"
                ? "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" /> Alert when ABOVE
          </button>
          <button
            type="button"
            onClick={() => setDirection("below")}
            className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
              direction === "below"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <TrendingDown className="h-3.5 w-3.5" /> Alert when BELOW
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">L$</span>
            <input
              type="number"
              value={targetRate}
              onChange={(e) => setTargetRate(e.target.value)}
              placeholder={direction === "above" ? "e.g. 186" : "e.g. 180"}
              className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 transition dark:bg-slate-950 dark:border-slate-800"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={saving || !targetRate}
            className="flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:bg-muted disabled:text-muted-foreground px-4 py-2.5 text-xs font-bold text-white transition"
          >
            <Plus className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Set Alert"}
          </button>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional — to notify you)"
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 transition dark:bg-slate-950 dark:border-slate-800"
        />
      </div>

      {savedMessage && (
        <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
          {savedMessage}
        </div>
      )}

      {alerts.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Your alerts</p>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${
                alert.triggered
                  ? "border-emerald-500/30 bg-emerald-500/5 opacity-60"
                  : "border-border/60 bg-muted/20"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {alert.triggered ? (
                  <Bell className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <BellOff className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                )}
                <span className="text-foreground truncate">
                  {alert.direction === "above" ? "↑ Above" : "↓ Below"} L$
                  {Number(alert.target_rate).toFixed(2)}
                </span>
                {alert.triggered && (
                  <Badge className="text-[10px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shrink-0">
                    Triggered!
                  </Badge>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(alert.id)}
                className="text-muted-foreground hover:text-rose-600 transition shrink-0 p-1"
                aria-label="Remove alert"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
