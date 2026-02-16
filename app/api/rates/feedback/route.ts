import { NextResponse } from "next/server"

/**
 * In-memory store for rate feedback (confirm/flag).
 * Replace with a database (e.g. Vercel KV, Postgres) for production persistence.
 */
const feedbackStore: Array<{
  type: "confirm" | "flag"
  rate?: number
  message?: string
  location?: string
  createdAt: string
}> = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const type = body?.type === "confirm" || body?.type === "flag" ? body.type : null
    if (!type) {
      return NextResponse.json(
        { error: "Missing or invalid 'type': use 'confirm' or 'flag'" },
        { status: 400 },
      )
    }

    const rate = typeof body?.rate === "number" && body.rate > 0 ? body.rate : undefined
    const message = typeof body?.message === "string" ? body.message.slice(0, 500) : undefined
    const location = typeof body?.location === "string" ? body.location.slice(0, 200) : undefined

    const entry = {
      type,
      rate,
      message,
      location,
      createdAt: new Date().toISOString(),
    }
    feedbackStore.push(entry)

    return NextResponse.json({ ok: true, id: feedbackStore.length - 1 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

/** Optional: GET for admins to read feedback (e.g. with auth). */
export async function GET() {
  return NextResponse.json({
    count: feedbackStore.length,
    recent: feedbackStore.slice(-50).reverse(),
  })
}
