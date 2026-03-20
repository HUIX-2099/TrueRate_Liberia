/**
 * Integration tests for Ministry of Commerce data APIs.
 * Run with: BASE_URL=http://localhost:3000 node --test tests/integration/moc-api.test.mjs
 * Or: pnpm test:integration (starts after app is running)
 */
import { describe, it } from "node:test"
import assert from "node:assert"

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"

async function fetchJSON(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "User-Agent": "TrueRate-Integration-Test/1.0" },
  })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(`Invalid JSON from ${path}: ${text.slice(0, 200)}`)
  }
  return { status: res.status, data }
}

describe("Ministry of Commerce APIs", () => {
  it("GET /api/health returns status and checks", async () => {
    const { status, data } = await fetchJSON("/api/health")
    assert.strictEqual(status, 200, "health should return 200")
    assert.ok(["ok", "degraded", "down"].includes(data?.status), "status should be ok/degraded/down")
    assert.ok(typeof data?.checks === "object", "checks should be object")
    assert.ok(typeof data?.timestamp === "string", "timestamp should be string")
  })

  it("GET /api/health/moc returns MoC module checks", async () => {
    const { status, data } = await fetchJSON("/api/health/moc")
    assert.strictEqual(status, 200, "health/moc should return 200")
    assert.ok(["ok", "degraded", "down"].includes(data?.status), "status should be ok/degraded/down")
    assert.ok(typeof data?.checks === "object", "checks should be object")
    const expected = [
      "commodity_prices",
      "trade_import_analytics",
      "market_risk",
      "cost_of_living",
      "sync_logs",
      "scheduler",
    ]
    for (const key of expected) {
      assert.ok(key in data.checks, `checks should include ${key}`)
      assert.ok(
        ["ok", "degraded", "down"].includes(data.checks[key]?.status),
        `${key}.status should be ok/degraded/down`
      )
    }
    assert.ok(Array.isArray(data?.moc?.syncSummary), "moc.syncSummary should be array")
    assert.ok(typeof data?.timestamp === "string", "timestamp should be string")
  })

  it("GET /api/monitoring/volatility returns series array", async () => {
    const { status, data } = await fetchJSON("/api/monitoring/volatility?days=7&window=7")
    assert.strictEqual(status, 200, "volatility should return 200")
    assert.ok(Array.isArray(data?.series), "series should be array")
  })

  it("GET /api/trade-analytics/volumes returns volumeAnalysis", async () => {
    const { status, data } = await fetchJSON("/api/trade-analytics/volumes?periods=6")
    assert.strictEqual(status, 200, "volumes should return 200")
    assert.ok(Array.isArray(data?.volumeAnalysis), "volumeAnalysis should be array")
  })

  it("GET /api/market-risk returns marketRiskScore and priceStabilityIndex", async () => {
    const { status, data } = await fetchJSON("/api/market-risk?days=30")
    assert.strictEqual(status, 200, "market-risk should return 200")
    assert.ok(
      typeof data?.marketRiskScore === "number" || data?.marketRiskScore === undefined,
      "marketRiskScore should be number or undefined"
    )
    assert.ok(
      typeof data?.priceStabilityIndex === "number" || data?.priceStabilityIndex === undefined,
      "priceStabilityIndex should be number or undefined"
    )
    assert.ok(typeof data?.riskLabel === "string" || data?.riskLabel === undefined, "riskLabel should be string")
  })

  it("GET /api/cost-of-living/dashboard returns aggregatedPrices and indices", async () => {
    const { status, data } = await fetchJSON("/api/cost-of-living/dashboard?days=30")
    assert.strictEqual(status, 200, "cost-of-living/dashboard should return 200")
    assert.ok(Array.isArray(data?.aggregatedPrices), "aggregatedPrices should be array")
    assert.ok(
      data?.costOfLivingIndex === null || typeof data?.costOfLivingIndex === "object",
      "costOfLivingIndex should be object or null"
    )
    assert.ok(
      data?.affordabilityIndex === null || typeof data?.affordabilityIndex === "object",
      "affordabilityIndex should be object or null"
    )
  })

  it("GET /api/sync-logs returns logs array", async () => {
    const { status, data } = await fetchJSON("/api/sync-logs")
    assert.strictEqual(status, 200, "sync-logs should return 200")
    assert.ok(Array.isArray(data?.logs), "logs should be array")
  })

  it("GET /api/scheduler/runs returns runs array", async () => {
    const { status, data } = await fetchJSON("/api/scheduler/runs?limit=5")
    assert.strictEqual(status, 200, "scheduler/runs should return 200")
    assert.ok(Array.isArray(data?.runs), "runs should be array")
  })

  it("GET /api/regulatory/overview returns counts and recent items", async () => {
    const { status, data } = await fetchJSON("/api/regulatory/overview")
    assert.strictEqual(status, 200, "regulatory/overview should return 200")
    assert.ok(typeof data?.tradePolicyCount === "number", "tradePolicyCount should be number")
    assert.ok(typeof data?.priceControlCount === "number", "priceControlCount should be number")
    assert.ok(Array.isArray(data?.recentRegulationChanges), "recentRegulationChanges should be array")
  })
})
