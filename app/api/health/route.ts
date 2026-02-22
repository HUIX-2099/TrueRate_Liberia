import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const LIVE_OK_MS = 3000
const LIVE_DELAYED_MS = 8000

type CheckStatus = "ok" | "delayed" | "down"

interface CheckResult {
  status: CheckStatus
  latencyMs?: number
  message?: string
}

async function measureFetch(url: string, timeoutMs: number): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const start = Date.now()
  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: { "User-Agent": "TrueRate-Health/1.0" },
    })
    clearTimeout(id)
    const latencyMs = Date.now() - start
    const ok = res.ok
    let error: string | undefined
    if (!res.ok) error = `HTTP ${res.status}`
    return { ok, latencyMs, error }
  } catch (e) {
    const latencyMs = Date.now() - start
    const error = e instanceof Error ? e.message : "Request failed"
    return { ok: false, latencyMs, error }
  }
}

function toStatus(ok: boolean, latencyMs: number, delayedThreshold: number): CheckStatus {
  if (!ok) return "down"
  if (latencyMs > delayedThreshold) return "delayed"
  return "ok"
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin
  const liveUrl = `${origin}/api/rates/live`
  const historicalUrl = `${origin}/api/rates/historical`
  const predictionsUrl = `${origin}/api/rates/predictions?days=7`

  const [liveResult, historicalResult, predictionsResult] = await Promise.all([
    measureFetch(liveUrl, 10000),
    measureFetch(historicalUrl, 10000),
    measureFetch(predictionsUrl, 10000),
  ])

  const checks: Record<string, CheckResult> = {
    live: {
      status: toStatus(liveResult.ok, liveResult.latencyMs, LIVE_DELAYED_MS),
      latencyMs: liveResult.latencyMs,
      message: liveResult.ok ? undefined : (liveResult.error ?? "Unavailable"),
    },
    historical: {
      status: toStatus(historicalResult.ok, historicalResult.latencyMs, LIVE_DELAYED_MS),
      latencyMs: historicalResult.latencyMs,
      message: historicalResult.ok ? undefined : (historicalResult.error ?? "Unavailable"),
    },
    predictions: {
      status: toStatus(predictionsResult.ok, predictionsResult.latencyMs, LIVE_DELAYED_MS),
      latencyMs: predictionsResult.latencyMs,
      message: predictionsResult.ok ? undefined : (predictionsResult.error ?? "Unavailable"),
    },
  }

  const allOk = Object.values(checks).every((c) => c.status === "ok")
  const anyDown = Object.values(checks).some((c) => c.status === "down")
  const overall = anyDown ? "down" : allOk ? "ok" : "degraded"

  return NextResponse.json({
    status: overall,
    checks,
    timestamp: new Date().toISOString(),
    links: { moc: "/api/health/moc" },
  })
}
