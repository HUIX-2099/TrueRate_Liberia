/**
 * Build SME/Business digest content: rate summary, price index comparison, market risk.
 * Used by GET /api/digest/sme and POST /api/digest/send.
 */

import { getAggregatedRate } from "@/lib/api/multi-source-rates"
import { getServerApiUrl } from "@/lib/api/server-base-url"

export interface SmeDigestData {
  generatedAt: string
  rate: {
    lrdPerUsd: number
    cblRate: number | null
    timestamp: string
  }
  priceIndex: {
    weekOverWeekPercent: number | null
    monthOverMonthPercent: number | null
    thisWeekAvgLrd: number | null
    thisMonthAvgLrd: number | null
  }
  risk: {
    marketRiskScore: number
    priceStabilityIndex: number
    riskLabel: string
    period: string
  }
}

export async function buildSmeDigestContent(baseUrl: string): Promise<{
  data: SmeDigestData
  subject: string
  html: string
  text: string
}> {
  const rateData = await getAggregatedRate()

  const [compareRes, riskRes] = await Promise.all([
    fetch(getServerApiUrl("/api/price-index/compare?days=60")),
    fetch(getServerApiUrl("/api/market-risk?days=90")),
  ])

  let priceIndex: SmeDigestData["priceIndex"] = {
    weekOverWeekPercent: null,
    monthOverMonthPercent: null,
    thisWeekAvgLrd: null,
    thisMonthAvgLrd: null,
  }
  if (compareRes.ok) {
    try {
      const compareJson = await compareRes.json()
      const pc = compareJson.periodComparison
      if (pc) {
        priceIndex = {
          weekOverWeekPercent: pc.weekOverWeekPercent ?? null,
          monthOverMonthPercent: pc.monthOverMonthPercent ?? null,
          thisWeekAvgLrd: pc.thisWeekAvg ?? null,
          thisMonthAvgLrd: pc.thisMonthAvg ?? null,
        }
      }
    } catch {
      // keep defaults
    }
  }

  let risk: SmeDigestData["risk"] = {
    marketRiskScore: 0,
    priceStabilityIndex: 50,
    riskLabel: "moderate",
    period: "latest",
  }
  if (riskRes.ok) {
    try {
      const riskJson = await riskRes.json()
      risk = {
        marketRiskScore: Number(riskJson.marketRiskScore) || 0,
        priceStabilityIndex: Number(riskJson.priceStabilityIndex) ?? 50,
        riskLabel: riskJson.riskLabel ?? "moderate",
        period: riskJson.period ?? "latest",
      }
    } catch {
      // keep defaults
    }
  }

  const generatedAt = new Date().toISOString()
  const data: SmeDigestData = {
    generatedAt,
    rate: {
      lrdPerUsd: rateData.rate,
      cblRate: rateData.cblRate ?? null,
      timestamp: rateData.timestamp ?? generatedAt,
    },
    priceIndex,
    risk,
  }

  const rateStr = data.rate.lrdPerUsd.toFixed(2)
  const cblStr = data.rate.cblRate != null ? data.rate.cblRate.toFixed(2) : "—"
  const weekPct =
    data.priceIndex.weekOverWeekPercent != null
      ? `${data.priceIndex.weekOverWeekPercent >= 0 ? "+" : ""}${data.priceIndex.weekOverWeekPercent}%`
      : "—"
  const monthPct =
    data.priceIndex.monthOverMonthPercent != null
      ? `${data.priceIndex.monthOverMonthPercent >= 0 ? "+" : ""}${data.priceIndex.monthOverMonthPercent}%`
      : "—"

  const subject = `TrueRate Liberia Digest — LRD ${rateStr} | Risk ${data.risk.riskLabel}`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #1a1a1a; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="font-size: 1.25rem; margin-bottom: 8px;">TrueRate Liberia — SME & Business Digest</h1>
  <p style="color: #666; font-size: 0.875rem; margin-bottom: 24px;">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>

  <section style="margin-bottom: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
    <h2 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 8px;">Exchange rate</h2>
    <p style="font-size: 1.5rem; font-weight: 700; margin: 0;">${rateStr} LRD / 1 USD</p>
    <p style="font-size: 0.875rem; color: #666; margin: 4px 0 0 0;">CBL official: ${cblStr} LRD</p>
  </section>

  <section style="margin-bottom: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
    <h2 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 8px;">Price index (essential basket)</h2>
    <p style="margin: 0 0 4px 0;">This week vs last week: <strong>${weekPct}</strong></p>
    <p style="margin: 0; font-size: 0.875rem; color: #666;">This month vs last month: <strong>${monthPct}</strong></p>
  </section>

  <section style="margin-bottom: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
    <h2 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 8px;">Market risk</h2>
    <p style="margin: 0 0 4px 0;">Risk level: <strong style="text-transform: capitalize;">${data.risk.riskLabel}</strong> (score ${data.risk.marketRiskScore}/100)</p>
    <p style="margin: 0; font-size: 0.875rem; color: #666;">Price stability index: ${data.risk.priceStabilityIndex}/100</p>
  </section>

  <p style="font-size: 0.875rem;"><a href="${baseUrl}" style="color: #2563eb;">View full rates, price index &amp; market intelligence →</a></p>
  <p style="font-size: 0.75rem; color: #888; margin-top: 24px;">You received this because you subscribed to the TrueRate Liberia digest. Unsubscribe via the app.</p>
</body>
</html>`.trim()

  const text = [
    `TrueRate Liberia — SME & Business Digest`,
    new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    "",
    "Exchange rate",
    `${rateStr} LRD / 1 USD | CBL official: ${cblStr} LRD`,
    "",
    "Price index (essential basket)",
    `This week vs last week: ${weekPct}`,
    `This month vs last month: ${monthPct}`,
    "",
    "Market risk",
    `Risk level: ${data.risk.riskLabel} (score ${data.risk.marketRiskScore}/100)`,
    `Price stability: ${data.risk.priceStabilityIndex}/100`,
    "",
    `View full data: ${baseUrl}`,
  ].join("\n")

  return { data, subject, html, text }
}
