import { NextResponse } from "next/server"

/**
 * In-memory store for "rate at this spot" community submissions.
 * Replace with a database for production.
 */
const reports: Array<{
  id: string
  lat: number
  lng: number
  rate: number
  message?: string
  photoUrl?: string
  createdAt: string
}> = []

function nextId(): string {
  return "r-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
}

export async function GET() {
  const limit = Math.min(Number(process.env.RATE_REPORTS_LIMIT) || 100, 200)
  const list = [...reports]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
  return NextResponse.json({ reports: list })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const lat = typeof body?.lat === "number" ? body.lat : undefined
    const lng = typeof body?.lng === "number" ? body.lng : undefined
    const rate = typeof body?.rate === "number" ? body.rate : undefined

    if (lat == null || lng == null || rate == null || rate < 100 || rate > 300) {
      return NextResponse.json(
        { error: "Valid lat, lng, and rate (100–300) are required" },
        { status: 400 },
      )
    }

    const message = typeof body?.message === "string" ? body.message.trim().slice(0, 500) : undefined
    const photoUrl = typeof body?.photoUrl === "string" && body.photoUrl.startsWith("http")
      ? body.photoUrl.slice(0, 512)
      : undefined

    const entry = {
      id: nextId(),
      lat,
      lng,
      rate,
      message,
      photoUrl,
      createdAt: new Date().toISOString(),
    }
    reports.push(entry)

    return NextResponse.json({ ok: true, report: entry })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
