import { NextResponse } from "next/server"
import { getSyncLogSummary } from "@/lib/scheduler"

export const dynamic = "force-dynamic"
export const revalidate = 0

type CheckStatus = "ok" | "degraded" | "down"

interface ModuleCheck {
  status: CheckStatus
  latencyMs?: number
  message?: string
  data?: unknown
}

async function probe(
  origin: string,
  path: string,
  timeoutMs = 8000
): Promise<{ ok: boolean; latencyMs: number; error?: string; data?: unknown }> {
  const start = Date.now()
  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(`${origin}${path}`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { "User-Agent": "TrueRate-Health-MoC/1.0" },
    })
    clearTimeout(t)
    const latencyMs = Date.now() - start
    const data = res.ok ? await res.json().catch(() => ({})) : undefined
    return {
      ok: res.ok,
      latencyMs,
      error: res.ok ? undefined : `HTTP ${res.status}`,
      data,
    }
  } catch (e) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: e instanceof Error ? e.message : "Request failed",
    }
  }
}

function toStatus(ok: boolean, latencyMs: number): CheckStatus {
  if (!ok) return "down"
  if (latencyMs > 5000) return "degraded"
  return "ok"
}

/**
 * GET /api/health/moc
 * Ministry of Commerce data modules health check: commodity, trade, market risk, cost of living, sync, scheduler.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin

  const [
    commodityRes,
    tradeRes,
    marketRiskRes,
    colRes,
    syncLogsRes,
    schedulerRes,
  ] = await Promise.all([
    probe(origin, "/api/monitoring/volatility?days=30&window=7"),
    probe(origin, "/api/trade-analytics/volumes?periods=12"),
    probe(origin, "/api/market-risk?days=30"),
    probe(origin, "/api/cost-of-living/dashboard?days=30"),
    probe(origin, "/api/sync-logs"),
    probe(origin, "/api/scheduler/runs?limit=5"),
  ])

  const checks: Record<string, ModuleCheck> = {
    commodity_prices: {
      status: toStatus(commodityRes.ok, commodityRes.latencyMs),
      latencyMs: commodityRes.latencyMs,
      message: commodityRes.error,
      data:
        commodityRes.data && typeof commodityRes.data === "object" && "series" in commodityRes.data
          ? { seriesCount: (commodityRes.data.series as unknown[])?.length ?? 0 }
          : undefined,
    },
    trade_import_analytics: {
      status: toStatus(tradeRes.ok, tradeRes.latencyMs),
      latencyMs: tradeRes.latencyMs,
      message: tradeRes.error,
      data:
        tradeRes.data && typeof tradeRes.data === "object" && "volumeAnalysis" in tradeRes.data
          ? { periodCount: (tradeRes.data.volumeAnalysis as unknown[])?.length ?? 0 }
          : undefined,
    },
    market_risk: {
      status: toStatus(marketRiskRes.ok, marketRiskRes.latencyMs),
      latencyMs: marketRiskRes.latencyMs,
      message: marketRiskRes.error,
      data:
        marketRiskRes.data &&
        typeof marketRiskRes.data === "object" &&
        "marketRiskScore" in marketRiskRes.data
          ? {
              marketRiskScore: (marketRiskRes.data as { marketRiskScore?: number }).marketRiskScore,
              priceStabilityIndex: (marketRiskRes.data as { priceStabilityIndex?: number }).priceStabilityIndex,
            }
          : undefined,
    },
    cost_of_living: {
      status: toStatus(colRes.ok, colRes.latencyMs),
      latencyMs: colRes.latencyMs,
      message: colRes.error,
      data:
        colRes.data && typeof colRes.data === "object" && "costOfLivingIndex" in colRes.data
          ? { hasIndex: !!(colRes.data as { costOfLivingIndex?: unknown }).costOfLivingIndex }
          : undefined,
    },
    sync_logs: {
      status: toStatus(syncLogsRes.ok, syncLogsRes.latencyMs),
      latencyMs: syncLogsRes.latencyMs,
      message: syncLogsRes.error,
    },
    scheduler: {
      status: toStatus(schedulerRes.ok, schedulerRes.latencyMs),
      latencyMs: schedulerRes.latencyMs,
      message: schedulerRes.error,
    },
  }

  const syncSummary = getSyncLogSummary()
  const anyDown = Object.values(checks).some((c) => c.status === "down")
  const anyDegraded = Object.values(checks).some((c) => c.status === "degraded")
  const overall = anyDown ? "down" : anyDegraded ? "degraded" : "ok"

  return NextResponse.json({
    status: overall,
    checks,
    moc: {
      syncSummary: syncSummary.map((s) => ({
        source: s.source,
        lastSync: s.lastSync,
        status: s.status,
      })),
    },
    timestamp: new Date().toISOString(),
  })
}
