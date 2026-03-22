import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function GET() {
  const supabase = createServiceRoleClient()
  if (!supabase) return NextResponse.json({ feedback: [] })
  const { data, error } = await supabase
    .from("rate_feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)
  if (error) {
    console.error("Rate feedback GET:", error.message)
    return NextResponse.json({ feedback: [] })
  }
  return NextResponse.json({ feedback: data ?? [] })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const directionFromType =
      body?.type === "confirm" || body?.type === "flag" ? (body.type as string) : null
    const direction =
      typeof body?.direction === "string"
        ? body.direction.trim().slice(0, 32)
        : directionFromType

    const entry = {
      rate: typeof body?.rate === "number" ? body.rate : null,
      direction,
      location: typeof body?.location === "string" ? body.location.trim().slice(0, 200) : null,
      message: typeof body?.message === "string" ? body.message.trim().slice(0, 1000) : null,
      source: typeof body?.source === "string" ? body.source.trim().slice(0, 64) : "community",
      created_at: new Date().toISOString(),
    }
    const supabase = createServiceRoleClient()
    if (supabase) {
      const { error } = await supabase.from("rate_feedback").insert(entry)
      if (error) console.error("Rate feedback error:", error.message)
    }
    return NextResponse.json({ ok: true, message: "Feedback recorded. Thank you." })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
