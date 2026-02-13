/**
 * Fetch live exchange rates from central banks.
 * Sources: CBL (Liberia), Bank of Ghana, ECB (Euro), CBN (Nigeria) where available.
 */

import { fetchCblLatestRate } from "@/lib/cbl-rates"

const FETCH_TIMEOUT_MS = 12000

const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs: number) => {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(t)
  }
}

/** Bank of Ghana daily interbank FX rates - GHS, NGN, SLL, EUR, GBP, XOF via cross-rates */
async function fetchBankOfGhanaRates(): Promise<Partial<Record<string, { rate: number; source: string }>> | null> {
  try {
    const res = await fetchWithTimeout(
      "https://www.bog.gov.gh/treasury-and-the-markets/daily-interbank-fx-rates/",
      { next: { revalidate: 86400 }, headers: { "User-Agent": "TrueRate-Liberia/1.0" } },
      FETCH_TIMEOUT_MS,
    )
    if (!res.ok) return null
    const html = await res.text()

    const extractMidRate = (pair: string): number | null => {
      const idx = html.indexOf(pair)
      if (idx < 0) return null
      const chunk = html.slice(idx)
      const nums = chunk.match(/[\d]+\.\d+/g)
      if (!nums || nums.length < 3) return null
      return Number.parseFloat(nums[2])
    }

    const usdGhs = extractMidRate("USDGHS")
    const usdGhsNum = usdGhs
    if (!usdGhsNum || usdGhsNum <= 0) return null

    const rates: Partial<Record<string, { rate: number; source: string }>> = {}
    rates.GHS = { rate: usdGhsNum, source: "Bank of Ghana" }

    const ghsNgn = extractMidRate("GHSNGN")
    if (ghsNgn && ghsNgn > 0) rates.NGN = { rate: usdGhsNum * ghsNgn, source: "Bank of Ghana (via GHS)" }

    const ghsSll = extractMidRate("GHSSLL")
    if (ghsSll && ghsSll > 0) rates.SLL = { rate: usdGhsNum * ghsSll, source: "Bank of Ghana (via GHS)" }

    const eurGhs = extractMidRate("EURGHS")
    if (eurGhs && eurGhs > 0) rates.EUR = { rate: usdGhsNum / eurGhs, source: "Bank of Ghana (via GHS)" }

    const gbpGhs = extractMidRate("GBPGHS")
    if (gbpGhs && gbpGhs > 0) rates.GBP = { rate: usdGhsNum / gbpGhs, source: "Bank of Ghana (via GHS)" }

    const ghsXof = extractMidRate("GHSXOF")
    if (ghsXof && ghsXof > 0) rates.XOF = { rate: usdGhsNum * ghsXof, source: "Bank of Ghana (via GHS)" }

    return Object.keys(rates).length > 0 ? rates : null
  } catch {
    return null
  }
}

/** ECB eurofxref daily - EUR per USD (inverted from ECB base) */
async function fetchEcbEurRate(): Promise<{ rate: number; source: string } | null> {
  try {
    const res = await fetchWithTimeout(
      "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml",
      { next: { revalidate: 86400 }, headers: { "User-Agent": "TrueRate-Liberia/1.0" } },
      FETCH_TIMEOUT_MS,
    )
    if (!res.ok) return null
    const xml = await res.text()
    const usdMatch = xml.match(/currency=["']USD["']\s+rate=["']([\d.]+)["']/i)
    if (!usdMatch) return null
    const eurPerUsd = 1 / Number.parseFloat(usdMatch[1])
    if (eurPerUsd <= 0 || eurPerUsd > 2) return null
    return { rate: eurPerUsd, source: "European Central Bank" }
  } catch {
    return null
  }
}

export interface CentralBankRates {
  LRD?: { rate: number; source: string }
  GHS?: { rate: number; source: string }
  NGN?: { rate: number; source: string }
  SLL?: { rate: number; source: string }
  EUR?: { rate: number; source: string }
  GBP?: { rate: number; source: string }
  XOF?: { rate: number; source: string }
}

/** Fetch rates from central banks in parallel. */
export async function fetchCentralBankRates(): Promise<CentralBankRates> {
  const out: CentralBankRates = {}

  const [cbl, bog, ecb] = await Promise.all([
    fetchCblLatestRate(),
    fetchBankOfGhanaRates(),
    fetchEcbEurRate(),
  ])

  if (cbl && cbl.rate > 150 && cbl.rate < 220) {
    out.LRD = { rate: cbl.rate, source: "Central Bank of Liberia" }
  }

  if (bog) {
    if (bog.GHS) out.GHS = bog.GHS
    if (bog.NGN) out.NGN = bog.NGN
    if (bog.SLL) out.SLL = bog.SLL
    if (bog.EUR) out.EUR = bog.EUR
    if (bog.GBP) out.GBP = bog.GBP
    if (bog.XOF) out.XOF = bog.XOF
  }

  if (ecb && !out.EUR) out.EUR = ecb

  return out
}
