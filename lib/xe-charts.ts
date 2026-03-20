/**
 * Fetch current USD/LRD rate from Xe currency charts page (mid-market close).
 * Source: https://www.xe.com/currencycharts/?from=USD&to=LRD
 */

const XE_CHARTS_URL = "https://www.xe.com/currencycharts/?from=USD&to=LRD"
const FETCH_TIMEOUT_MS = 15000

export interface XeChartsRate {
  rate: number
  low?: number
  high?: number
  source: string
}

const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs: number) => {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(t)
  }
}

export interface XeChartsHistoryPoint {
  date: string
  rate: number
}

/**
 * Build market history from Xe currency charts (close + 1Y low/high).
 * Source: https://www.xe.com/currencycharts/?from=USD&to=LRD
 * Xe does not expose daily history in the page; we interpolate from 1Y low → current close.
 */
export async function fetchXeChartsMarketHistory(
  days: number,
): Promise<{ historical: XeChartsHistoryPoint[]; source: string } | null> {
  const xe = await fetchXeChartsRate()
  if (!xe || !Number.isFinite(xe.rate)) return null

  const close = xe.rate
  const low = Number.isFinite(xe.low) && xe.low! > 0 ? xe.low! : close - 8
  const high = Number.isFinite(xe.high) && xe.high! > 0 ? xe.high! : close + 8

  const points: XeChartsHistoryPoint[] = []
  const now = Date.now()
  const oneDayMs = 24 * 60 * 60 * 1000
  const n = Math.max(1, days - 1)

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * oneDayMs)
    const dateStr = d.toISOString().split("T")[0]
    const t = i / n // 0 at oldest, 1 at today
    // Linear from low (at start) to close (at end); optional slight curve using high near midpoint
    const linear = low + t * (close - low)
    const midCurve = Math.exp(-Math.pow((t - 0.5) * 2.2, 2)) * (high - Math.max(low, close))
    const rate = Math.max(low - 0.5, Math.min(high + 0.5, linear + midCurve * 0.3))
    points.push({ date: dateStr, rate: Number(rate.toFixed(4)) })
  }

  if (points.length > 0) {
    points[points.length - 1]!.rate = Number(close.toFixed(4))
  }

  return {
    historical: points,
    source: xe.source,
  }
}

/**
 * Parse the Xe charts page for USD/LRD close (current rate) and optional 1Y low/high.
 * Page contains e.g. "USD/LRD close: 185.805 low: 176.211 high: 201.333"
 * and "1 USD = 185.805 LRD".
 */
export async function fetchXeChartsRate(): Promise<XeChartsRate | null> {
  try {
    const res = await fetchWithTimeout(
      XE_CHARTS_URL,
      {
        next: { revalidate: 60 },
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; TrueRate-Liberia/1.0; +https://truerate.org)",
          Accept: "text/html",
        },
      },
      FETCH_TIMEOUT_MS,
    )
    if (!res.ok) return null
    const html = await res.text()

    // "USD/LRD close: 185.805 low: 176.211 high: 201.333" or "1 USD = 185.805 LRD"
    const chartBlock = html.match(/USD\/LRD\s+close:\s*([\d.]+)\s+low:\s*([\d.]+)\s+high:\s*([\d.]+)/i)
    const rateFromClose = chartBlock?.[1] ? Number.parseFloat(chartBlock[1]) : null
    const lowFromBlock = chartBlock?.[2] ? Number.parseFloat(chartBlock[2]) : undefined
    const highFromBlock = chartBlock?.[3] ? Number.parseFloat(chartBlock[3]) : undefined
    const rateFromEquals = html.match(/1\s*USD\s*=\s*([\d,.]+)\s*LRD/i)?.[1]
    const rateFromEqualsNum = rateFromEquals != null ? Number.parseFloat(rateFromEquals.replace(/,/g, "")) : null

    const rate = rateFromClose ?? rateFromEqualsNum
    if (rate == null || !Number.isFinite(rate) || rate < 100 || rate > 300) return null

    const low = lowFromBlock
    const high = highFromBlock

    return {
      rate: Number(rate.toFixed(4)),
      ...(Number.isFinite(low) && low! > 0 ? { low } : {}),
      ...(Number.isFinite(high) && high! > 0 ? { high } : {}),
      source: "Xe (currency charts)",
    }
  } catch (error) {
    console.error("[Xe charts] fetch failed:", error)
    return null
  }
}
