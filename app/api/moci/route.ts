import { NextResponse } from "next/server"
import { fetchMociPageData, generateMociCommodityData, generateMociImportData } from "@/lib/moci"

export const dynamic = "force-dynamic"
export const revalidate = 0

type IncludeParam = "commodity" | "import" | "all" | ""

/**
 * GET /api/moci
 * Fetches data from https://www.moci.gov.lr/ and optionally returns generated commodity/import fixture data.
 * Query: include=commodity | import | all (optional)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const include = (searchParams.get("include") ?? "") as IncludeParam

  try {
    const pageData = await fetchMociPageData()
    const period = new Date().toISOString().slice(0, 7) // YYYY-MM

    const payload: Record<string, unknown> = {
      page: pageData,
      source: "https://www.moci.gov.lr/",
      fetchedAt: pageData.fetchedAt,
    }

    if (include === "commodity" || include === "all") {
      payload.commodity = generateMociCommodityData(period)
    }
    if (include === "import" || include === "all") {
      payload.import = generateMociImportData(period)
    }

    return NextResponse.json(payload)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch MoCI data"
    return NextResponse.json(
      { error: message, source: "https://www.moci.gov.lr/" },
      { status: 503 }
    )
  }
}
