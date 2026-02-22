"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageTheme } from "@/components/page-theme"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, Activity, Server, Database } from "lucide-react"
import { useEffect, useState } from "react"

type CheckStatus = "ok" | "delayed" | "down" | "degraded"

interface CheckResult {
  status: CheckStatus
  latencyMs?: number
  message?: string
}

interface HealthData {
  status: "ok" | "degraded" | "down"
  checks: Record<string, CheckResult>
  timestamp: string
  links?: { moc?: string }
}

interface MoCHealthData {
  status: string
  checks: Record<string, CheckResult & { data?: unknown }>
  moc?: { syncSummary: Array<{ source: string; lastSync: string; status: string }> }
  timestamp: string
}

const LABELS: Record<string, string> = {
  live: "Live rate API",
  historical: "Historical rates",
  predictions: "Predictions API",
}

const MOC_LABELS: Record<string, string> = {
  commodity_prices: "Commodity prices",
  trade_import_analytics: "Trade / import analytics",
  market_risk: "Market risk engine",
  cost_of_living: "Cost of living index",
  sync_logs: "Sync logs",
  scheduler: "Data sync scheduler",
}

function StatusIcon({ status }: { status: CheckStatus }) {
  switch (status) {
    case "ok":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />
    case "delayed":
    case "degraded":
      return <AlertTriangle className="h-5 w-5 text-amber-600" />
    case "down":
      return <XCircle className="h-5 w-5 text-destructive" />
    default:
      return null
  }
}

function StatusBadge({ status }: { status: CheckStatus }) {
  const variant = status === "ok" ? "default" : status === "delayed" || status === "degraded" ? "secondary" : "destructive"
  const label = status === "ok" ? "OK" : status === "delayed" || status === "degraded" ? (status === "degraded" ? "Degraded" : "Delayed") : "Down"
  return <Badge variant={variant}>{label}</Badge>
}

export default function StatusPage() {
  const [data, setData] = useState<HealthData | null>(null)
  const [mocData, setMocData] = useState<MoCHealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHealth = async () => {
    setLoading(true)
    setError(null)
    try {
      const [res, mocRes] = await Promise.all([
        fetch("/api/health"),
        fetch("/api/health/moc"),
      ])
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error ?? "Failed to fetch")
      setData(json)
      if (mocRes.ok) setMocData(await mocRes.json())
      else setMocData(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
      setData(null)
      setMocData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    const id = setInterval(fetchHealth, 60_000)
    return () => clearInterval(id)
  }, [])

  const overall = data?.status ?? "down"
  const overallLabel = overall === "ok" ? "All systems operational" : overall === "degraded" ? "Degraded" : "Outage"
  const mocOverall = mocData?.status ?? "down"

  return (
    <PageTheme theme="dark">
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="py-10 sm:py-14 md:py-24 flex-1 bg-background pb-20 md:pb-0 overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-2 gap-1">
                <Activity className="h-3.5 w-3.5" />
                System status
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">System & Ministry data services</h1>
              <p className="text-muted-foreground">
                Rate APIs and Ministry of Commerce data modules (commodity, trade, market risk, cost of living).
              </p>
            </div>

            {loading && !data && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Checking services…
                </CardContent>
              </Card>
            )}

            {error && !data && (
              <Card className="border-destructive/50">
                <CardContent className="py-6">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={fetchHealth} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}

            {data && (
              <>
                <Card className={
                  overall === "ok" ? "border-green-500/30 bg-green-50/30 dark:bg-green-950/20" :
                  overall === "degraded" ? "border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/20" :
                  "border-destructive/30 bg-destructive/5"
                }>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <StatusIcon status={overall === "ok" ? "ok" : overall === "degraded" ? "delayed" : "down"} />
                      {overallLabel}
                    </CardTitle>
                    <Badge variant={overall === "ok" ? "default" : overall === "degraded" ? "secondary" : "destructive"}>
                      {overall.toUpperCase()}
                    </Badge>
                  </CardHeader>
                  <CardDescription>
                    Last checked: {data.timestamp ? new Date(data.timestamp).toLocaleString() : "—"}
                  </CardDescription>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Rate sources & APIs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {Object.entries(data.checks).map(([key, check]) => (
                        <div key={key} className="flex flex-row items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                          <div className="flex items-center gap-3">
                            <StatusIcon status={check.status} />
                            <div>
                              <div className="font-medium">{LABELS[key] ?? key}</div>
                              {check.latencyMs != null && (
                                <div className="text-xs text-muted-foreground">{check.latencyMs} ms</div>
                              )}
                              {check.message && (
                                <div className="text-xs text-destructive">{check.message}</div>
                              )}
                            </div>
                          </div>
                          <StatusBadge status={check.status} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className={
                  mocOverall === "ok" ? "border-green-500/30 bg-green-50/30 dark:bg-green-950/20" :
                  mocOverall === "degraded" ? "border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/20" :
                  "border-destructive/30 bg-destructive/5"
                }>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      Ministry of Commerce data services
                    </CardTitle>
                    <Badge variant={mocOverall === "ok" ? "default" : mocOverall === "degraded" ? "secondary" : "destructive"}>
                      {mocOverall.toUpperCase()}
                    </Badge>
                  </CardHeader>
                  <CardDescription>
                    Commodity prices, trade/import analytics, market risk, cost of living, sync logs, scheduler
                  </CardDescription>
                  <CardContent className="pt-4">
                    {mocData?.checks ? (
                      <div className="space-y-3">
                        {Object.entries(mocData.checks).map(([key, check]) => (
                          <div key={key} className="flex flex-row items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                            <div className="flex items-center gap-3">
                              <StatusIcon status={check.status as CheckStatus} />
                              <div>
                                <div className="font-medium">{MOC_LABELS[key] ?? key}</div>
                                {check.latencyMs != null && (
                                  <div className="text-xs text-muted-foreground">{check.latencyMs} ms</div>
                                )}
                                {check.message && (
                                  <div className="text-xs text-destructive">{check.message}</div>
                                )}
                              </div>
                            </div>
                            <StatusBadge status={check.status as CheckStatus} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Ministry health check unavailable.</p>
                    )}
                    {mocData?.moc?.syncSummary && mocData.moc.syncSummary.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Data sync (last run)</p>
                        <ul className="text-xs space-y-1">
                          {mocData.moc.syncSummary.map((s) => (
                            <li key={s.source}>
                              {s.source}: {new Date(s.lastSync).toLocaleString()} — {s.status}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="outline" asChild size="sm">
                    <a href="/admin/monitoring">Monitoring dashboard</a>
                  </Button>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline" onClick={fetchHealth} disabled={loading} className="gap-2">
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
    </PageTheme>
  )
}
