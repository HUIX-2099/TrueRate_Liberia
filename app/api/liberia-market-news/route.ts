import { NextResponse } from "next/server"
import { fetchLiberiaNews } from "@/components/liberia-market-news"
import { formatDistanceToNow } from "date-fns"

export const revalidate = 3600

export async function GET() {
  try {
    const items = await fetchLiberiaNews()
    const mapped = items.map((item) => ({
      title: item.title,
      source: item.source,
      time: formatDistanceToNow(item.publishedAt, { addSuffix: true }),
      summary: item.excerpt,
      url: item.url,
      impact: "neutral" as const,
    }))
    return NextResponse.json({ items: mapped })
  } catch (error) {
    console.error("[LiberiaMarketNews API] Error:", error)
    return NextResponse.json({ items: [] }, { status: 200 })
  }
}
