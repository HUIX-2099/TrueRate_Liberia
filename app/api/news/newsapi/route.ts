import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=Liberia+economy+finance&sortBy=publishedAt&pageSize=6&apiKey=${process.env.NEWS_API_KEY}`,
    { cache: "no-store" }
  )
  const data = await res.json()
  return NextResponse.json(data.articles ?? [])
}
