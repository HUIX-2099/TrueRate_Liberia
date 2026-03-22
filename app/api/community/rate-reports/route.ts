import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

function nextId(): string {
  return "r-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
}

export async function GET() {
  const supabase = createServiceRoleClient()
  if (!supabase) return NextResponse.json({ reports: [] })

  const { data, error } = await supabase
    .from("community_rate_reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ reports: [] })
  return NextResponse.json({ reports: data ?? [] })
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

    const id = nextId()
    const entry = {
      id,
      lat,
      lng,
      rate,
      location_name: typeof body?.locationName === "string" ? body.locationName.trim().slice(0, 200) : "",
      message: typeof body?.message === "string" ? body.message.trim().slice(0, 500) : "",
      photo_url: typeof body?.photoUrl === "string" ? body.photoUrl.trim().slice(0, 500) : "",
      user_id: typeof body?.userId === "string" ? body.userId.trim().slice(0, 64) : "anonymous",
      verified: false,
      created_at: new Date().toISOString(),
    }

    const supabase = createServiceRoleClient()
    if (supabase) {
      const { error } = await supabase.from("community_rate_reports").insert(entry)
      if (error) console.error("Supabase rate report error:", error.message)
    }

    return NextResponse.json({ ok: true, id, report: entry })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
