import { NextResponse } from "next/server"

import { fetchCblLatestRate } from "@/lib/cbl-rates"

const MULTI_API_URL = "https://open.er-api.com/v6/latest/USD"
const FALLBACK_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"

const CURRENCY_CODES = ["USD", "LRD", "SLL", "EUR", "GBP", "NGN", "GHS", "XOF"] as const

const STATIC_FALLBACK: Record<string, number> = {
  USD: 1,
  LRD: 192.5,
  SLL: 22000,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1580,
  GHS: 14.85,
  XOF: 603,
}

function extractRatesFromOpenEr(data: { rates?: Record<string, number> }): Record<string, number> {
  const rates = data?.rates ?? {}
  const out: Record<string, number> = {}
  for (const code of CURRENCY_CODES) {
    const v = rates[code] ?? rates[code.toLowerCase()]
    if (typeof v === "number" && v > 0) out[code] = v
  }
  return out
}

function extractRatesFromFawaz(data: { usd?: Record<string, number> }): Record<string, number> {
  const usd = data?.usd ?? {}
  const out: Record<string, number> = {}
  for (const code of CURRENCY_CODES) {
    const key = code.toLowerCase()
    const v = usd[key]
    if (typeof v === "number" && v > 0) out[code] = v
  }
  return out
}

export async function GET() {
  try {
    const [cbl, multiRes] = await Promise.all([
      fetchCblLatestRate(),
      fetch(MULTI_API_URL, { next: { revalidate: 300 }, headers: { "User-Agent": "TrueRate-Liberia/1.0" } }),
    ])

    const rates: Record<string, number> = { USD: 1 }

    if (multiRes.ok) {
      const data = await multiRes.json()
      const apiRates = extractRatesFromOpenEr(data)
      for (const code of CURRENCY_CODES) {
        if (code === "USD") continue
        rates[code] = apiRates[code] ?? STATIC_FALLBACK[code]
      }
    } else {
      Object.assign(rates, STATIC_FALLBACK)
      delete rates.USD
      rates.USD = 1
    }

    if (Object.keys(rates).length < CURRENCY_CODES.length) {
      try {
        const fallbackRes = await fetch(FALLBACK_URL, { next: { revalidate: 300 } })
        if (fallbackRes.ok) {
          const data = await fallbackRes.json()
          const fawazRates = extractRatesFromFawaz(data)
          for (const [k, v] of Object.entries(fawazRates)) {
            if (k !== "USD" && (!rates[k] || rates[k] <= 0)) rates[k] = v
          }
        }
      } catch {
        // ignore
      }
    }

    if (cbl && cbl.rate > 150 && cbl.rate < 220) rates.LRD = cbl.rate

    for (const code of CURRENCY_CODES) {
      if (!rates[code] || rates[code] <= 0) {
        rates[code] = STATIC_FALLBACK[code] ?? 1
      }
    }

    return NextResponse.json({
      rates,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Rates Multi] Error:", error)
    return NextResponse.json(
      { rates: STATIC_FALLBACK, timestamp: new Date().toISOString() },
      { status: 200 },
    )
  }
}

export const revalidate = 60
