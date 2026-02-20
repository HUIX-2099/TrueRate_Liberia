import { NextResponse } from "next/server"
import { getInflationSeries, LIBERIA_INFLATION_HISTORY, INFLATION_DATA_SOURCES } from "@/lib/inflation-history"

export const dynamic = "force-dynamic"
export const revalidate = 0

export interface InflationSeriesPoint {
  year: string
  cpi: number
  inflation: number
}

export interface InflationApiResponse {
  series: InflationSeriesPoint[]
  sources: { name: string; url: string }[]
  baseYear: number
  latestFromLISGIS: boolean
}

export async function GET() {
  try {
    const lastHistorical = LIBERIA_INFLATION_HISTORY[LIBERIA_INFLATION_HISTORY.length - 1]
    if (!lastHistorical) {
      return NextResponse.json({
        series: LIBERIA_INFLATION_HISTORY,
        sources: INFLATION_DATA_SOURCES,
        baseYear: 2018,
        latestFromLISGIS: false,
      } satisfies InflationApiResponse)
    }

    let series = getInflationSeries()
    let latestFromLISGIS = false

    try {
      const base =
        process.env.NEXT_PUBLIC_APP_URL ??
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
      const res = await fetch(new URL("/api/liberia-cpi", base).toString(), { cache: "no-store" })
      if (res.ok) {
        const data = (await res.json()) as {
          inflationYoY?: number
          lastMonth?: string
          source?: string
        }
        const yoy = data.inflationYoY
        const monthYear = data.lastMonth ?? ""
        const yearMatch = monthYear.match(/\d{4}/)
        const latestYear = yearMatch ? yearMatch[0] : lastHistorical.year
        if (yoy != null && !Number.isNaN(yoy) && Number(latestYear) >= Number(lastHistorical.year)) {
          const prev = series.find((p) => p.year === String(Number(latestYear) - 1))
          const prevCpi = prev?.cpi ?? lastHistorical.cpi
          const cpi = prevCpi * (1 + yoy / 100)
          series = getInflationSeries({
            year: latestYear,
            cpi,
            inflationYoY: yoy,
          })
          latestFromLISGIS = (data.source ?? "").toLowerCase().includes("lisgis")
        }
      }
    } catch (e) {
      console.error("[Inflation API] Liberia CPI fetch failed", e)
    }

    return NextResponse.json({
      series,
      sources: INFLATION_DATA_SOURCES,
      baseYear: 2018,
      latestFromLISGIS,
    } satisfies InflationApiResponse)
  } catch (error) {
    console.error("[Inflation API]", error)
    return NextResponse.json(
      {
        series: LIBERIA_INFLATION_HISTORY,
        sources: INFLATION_DATA_SOURCES,
        baseYear: 2018,
        latestFromLISGIS: false,
      } satisfies InflationApiResponse,
      { status: 200 },
    )
  }
}
