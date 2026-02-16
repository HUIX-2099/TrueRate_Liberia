"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, Activity } from "lucide-react"
import { useEffect, useState } from "react"

type CheckStatus = "ok" | "delayed" | "down"

interface CheckResult {
  status: CheckStatus
  latencyMs?: number
  message?: string
}

interface HealthData {
  status: "ok" | "degraded" | "down"
  checks: Record<string, CheckResult>
  timestamp: string
}

const LABELS: Record<string, string> = {
  live: "Live rate API",
  historical: "Historical rates",
  predictions: "Predictions API",
}

function StatusIcon({ status }: { status: CheckStatus }) {
  switch (status) {
    case "ok":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />
    case "delayed":
      return <AlertTriangle className="h-5 w-5 text-amber-600" />
    case "down":
      return <XCircle className="h-5 w-5 text-destructive" />
    default:
      return null
  }
}

function StatusBadge({ status }: { status: CheckStatus }) {
  const variant = status === "ok" ? "default" : status === "delayed" ? "secondary" : "destructive"
  const label = status === "ok" ? "OK" : status === "delayed" ? "Delayed" : "Down"
  return <Badge variant={variant}>{label}</Badge>
}

export default function StatusPage() {
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHealth = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/health")
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error ?? "Failed to fetch")
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
      setData(null)
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="py-12 sm:py-14 md:py-24 flex-1 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-2 gap-1">
                <Activity className="h-3.5 w-3.5" />
                System status
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Rate sources & services</h1>
              <p className="text-muted-foreground">
                Real-time status of live rate, historical, and prediction APIs.
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

                <div className="space-y-3">
                  {Object.entries(data.checks).map(([key, check]) => (
                    <Card key={key}>
                      <CardContent className="py-4 flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <StatusIcon status={check.status} />
                          <div>
                            <div className="font-medium">{LABELS[key] ?? key}</div>
                            {check.latencyMs != null && (
                              <div className="text-xs text-muted-foreground">
                                {check.latencyMs} ms
                              </div>
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
  )
}
