"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Activity,
  Server,
  Database,
  BarChart3,
  Shield,
  Clock,
} from "lucide-react"

type CheckStatus = "ok" | "degraded" | "down"

interface ModuleCheck {
  status: CheckStatus
  latencyMs?: number
  message?: string
  data?: unknown
}

interface MoCHealth {
  status: string
  checks: Record<string, ModuleCheck>
  moc?: { syncSummary: Array<{ source: string; lastSync: string; status: string }> }
  timestamp: string
}

interface RateHealth {
  status: string
  checks: Record<string, { status: CheckStatus; latencyMs?: number; message?: string }>
  timestamp: string
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
      return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
    case "degraded":
      return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
    case "down":
      return <XCircle className="h-5 w-5 text-destructive" />
    default:
      return null
  }
}

function StatusBadge({ status }: { status: CheckStatus }) {
  const variant = status === "ok" ? "default" : status === "degraded" ? "secondary" : "destructive"
  const label = status === "ok" ? "OK" : status === "degraded" ? "Degraded" : "Down"
  return <Badge variant={variant}>{label}</Badge>
}

export default function MonitoringDashboardPage() {
  const [mocHealth, setMocHealth] = useState<MoCHealth | null>(null)
  const [rateHealth, setRateHealth] = useState<RateHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<string | null>(null)

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const [mocRes, rateRes] = await Promise.all([
        fetch("/api/health/moc"),
        fetch("/api/health"),
      ])
      if (mocRes.ok) setMocHealth(await mocRes.json())
      else setMocHealth(null)
      if (rateRes.ok) setRateHealth(await rateRes.json())
      else setRateHealth(null)
      setLastFetch(new Date().toISOString())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch")
      setMocHealth(null)
      setRateHealth(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
    const id = setInterval(fetchAll, 30_000)
    return () => clearInterval(id)
  }, [])

  const mocOverall = mocHealth?.status ?? "down"
  const rateOverall = rateHealth?.status ?? "down"

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30 pb-20 md:pb-0">
        <section className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Service monitoring</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Ministry of Commerce data services and rate APIs — status and latency
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
            {lastFetch && (
              <p className="text-xs text-muted-foreground mt-2">
                Last updated: {new Date(lastFetch).toLocaleString()}
              </p>
            )}
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
          <Tabs defaultValue="moc">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="moc" className="gap-2">
                <Server className="h-4 w-4" />
                Ministry data services
              </TabsTrigger>
              <TabsTrigger value="rates" className="gap-2">
                <Activity className="h-4 w-4" />
                Rate APIs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="moc" className="space-y-4 mt-4">
              <Card className={
                mocOverall === "ok" ? "border-green-500/30 bg-green-50/30 dark:bg-green-950/20" :
                mocOverall === "degraded" ? "border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/20" :
                "border-destructive/30 bg-destructive/5"
              }>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    MoC data services
                  </CardTitle>
                  <Badge variant={mocOverall === "ok" ? "default" : mocOverall === "degraded" ? "secondary" : "destructive"}>
                    {mocOverall.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardDescription>
                  Commodity, trade, market risk, cost of living, sync logs, scheduler
                </CardDescription>
              </Card>

              {loading && !mocHealth && (
                <Card><CardContent className="py-8 text-center text-muted-foreground">Loading…</CardContent></Card>
              )}

              {mocHealth && (
                <div className="space-y-3">
                  {Object.entries(mocHealth.checks).map(([key, check]) => (
                    <Card key={key}>
                      <CardContent className="py-4 flex flex-row items-center justify-between gap-4">
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
                            {check.data && typeof check.data === "object" && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {JSON.stringify(check.data)}
                              </div>
                            )}
                          </div>
                        </div>
                        <StatusBadge status={check.status as CheckStatus} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {mocHealth?.moc?.syncSummary && mocHealth.moc.syncSummary.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Data sync summary
                    </CardTitle>
                    <CardDescription>Last run per source</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {mocHealth.moc.syncSummary.map((s) => (
                        <li key={s.source} className="flex items-center justify-between text-sm">
                          <span>{s.source}</span>
                          <span className="text-muted-foreground">
                            {new Date(s.lastSync).toLocaleString()} —{" "}
                            <Badge variant={s.status === "success" ? "default" : "secondary"} className="text-xs">
                              {s.status}
                            </Badge>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rates" className="space-y-4 mt-4">
              <Card className={
                rateOverall === "ok" ? "border-green-500/30 bg-green-50/30 dark:bg-green-950/20" :
                rateOverall === "degraded" ? "border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/20" :
                "border-destructive/30 bg-destructive/5"
              }>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Rate APIs
                  </CardTitle>
                  <Badge variant={rateOverall === "ok" ? "default" : rateOverall === "degraded" ? "secondary" : "destructive"}>
                    {rateOverall.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardDescription>
                  Live rate, historical, predictions
                </CardDescription>
              </Card>

              {rateHealth && (
                <div className="space-y-3">
                  {Object.entries(rateHealth.checks).map(([key, check]) => (
                    <Card key={key}>
                      <CardContent className="py-4 flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <StatusIcon status={check.status} />
                          <div>
                            <div className="font-medium">
                              {key === "live" ? "Live rate API" : key === "historical" ? "Historical rates" : "Predictions API"}
                            </div>
                            {check.latencyMs != null && (
                              <div className="text-xs text-muted-foreground">{check.latencyMs} ms</div>
                            )}
                            {check.message && (
                              <div className="text-xs text-destructive">{check.message}</div>
                            )}
                          </div>
                        </div>
                        <StatusBadge status={check.status} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Quick links
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/status">System status page</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/market-intelligence">Market intelligence</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/api/health/moc" target="_blank" rel="noopener noreferrer">API: Health MoC (JSON)</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
