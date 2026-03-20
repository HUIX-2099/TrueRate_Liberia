import { NextRequest, NextResponse } from "next/server"
import { getServerApiUrl } from "@/lib/api/server-base-url"

const FAIR_THRESHOLD_PERCENT = 15 // Within ±15% of benchmark = fair

/**
 * GET /api/price-check?item=rice-thai&priceLRD=2000
 * Returns whether the given price is fair, overpriced, or underpriced vs market benchmark.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemParam = searchParams.get("item")?.trim()
    const priceParam = searchParams.get("priceLRD")?.trim()

    if (!itemParam || !priceParam) {
      return NextResponse.json(
        { error: "Missing item or priceLRD", usage: "?item=rice-thai&priceLRD=2000" },
        { status: 400 }
      )
    }

    const userPriceLRD = Number.parseFloat(priceParam.replace(/,/g, ""))
    if (!Number.isFinite(userPriceLRD) || userPriceLRD < 0) {
      return NextResponse.json({ error: "Invalid priceLRD" }, { status: 400 })
    }

    const res = await fetch(getServerApiUrl("/api/price-index"), { next: { revalidate: 60 } })
    if (!res.ok) {
      return NextResponse.json({ error: "Could not load price index" }, { status: 502 })
    }
    const data = (await res.json()) as {
      items?: Array<{ key?: string; name?: string; priceLRD?: number }>
      rate?: number
    }
    const items = data?.items ?? []

    const itemKey = itemParam.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const match =
      items.find((i) => (i.key ?? "").toLowerCase() === itemKey) ??
      items.find((i) => (i.name ?? "").toLowerCase().includes(itemParam.toLowerCase()))

    if (!match || typeof match.priceLRD !== "number") {
      const suggestions = items
        .slice(0, 20)
        .map((i) => i.key ?? i.name ?? "")
        .filter(Boolean)
      return NextResponse.json({
        error: "Item not found",
        suggestions: suggestions.slice(0, 10),
        usage: "Use ?item=<key> e.g. rice-thai, gas, bread",
      }, { status: 404 })
    }

    const benchmarkLRD = match.priceLRD
    const percentDiff =
      benchmarkLRD === 0 ? 0 : Number((((userPriceLRD - benchmarkLRD) / benchmarkLRD) * 100).toFixed(1))
    const absPercent = Math.abs(percentDiff)

    let verdict: "fair" | "overpriced" | "underpriced"
    let message: string
    if (absPercent <= FAIR_THRESHOLD_PERCENT) {
      verdict = "fair"
      message =
        percentDiff === 0
          ? "Matches typical market price."
          : percentDiff > 0
            ? `Slightly above market (${percentDiff}%). Still fair.`
            : `Slightly below market (${percentDiff}%). Good deal.`
    } else if (percentDiff > 0) {
      verdict = "overpriced"
      message = `About ${percentDiff}% above typical market. Consider shopping around.`
    } else {
      verdict = "underpriced"
      message = `About ${Math.abs(percentDiff)}% below typical market. Good value.`
    }

    return NextResponse.json({
      item: { key: match.key, name: match.name, benchmarkLRD },
      priceLRD: userPriceLRD,
      verdict,
      percentDiff,
      message,
      source: "TrueRate Price Index (LISGIS / Ministry of Commerce)",
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Price check]", error)
    return NextResponse.json(
      { error: "Price check failed" },
      { status: 500 }
    )
  }
}
