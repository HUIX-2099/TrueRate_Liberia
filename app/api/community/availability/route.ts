import { NextResponse, type NextRequest } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"

function nextId(): string {
  return "av-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
}

export async function GET(request: NextRequest) {
  const supabase = createServiceRoleClient()
  if (!supabase) return NextResponse.json({ reports: [] })

  const itemType = request.nextUrl.searchParams.get("type")
  const county = request.nextUrl.searchParams.get("county")

  let query = supabase
    .from("community_availability")
    .select("*")
    .order("reported_at", { ascending: false })
    .limit(50)

  if (itemType) query = query.eq("item_type", itemType)
  if (county) query = query.eq("county", county)

  const { data, error } = await query
  if (error) {
    console.error("Community availability GET:", error.message)
    return NextResponse.json({ reports: [] })
  }
  return NextResponse.json({ reports: data ?? [] })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const itemType = typeof body?.itemType === "string" ? body.itemType.trim() : ""
    const itemName = typeof body?.itemName === "string" ? body.itemName.trim() : ""
    const location = typeof body?.location === "string" ? body.location.trim() : ""

    if (!itemType || !itemName || !location) {
      return NextResponse.json(
        { error: "itemType, itemName, and location are required" },
        { status: 400 },
      )
    }

    const id = nextId()
    const entry = {
      id,
      item_type: itemType.slice(0, 32),
      item_name: itemName.slice(0, 128),
      available: body?.available !== false,
      price: typeof body?.price === "number" ? body.price : null,
      currency: body?.currency === "USD" ? "USD" : "LRD",
      location: location.slice(0, 200),
      county: typeof body?.county === "string" ? body.county.trim().slice(0, 64) : null,
      lat: typeof body?.lat === "number" ? body.lat : null,
      lng: typeof body?.lng === "number" ? body.lng : null,
      wait_time: typeof body?.waitTime === "string" ? body.waitTime.trim().slice(0, 64) : null,
      notes: typeof body?.notes === "string" ? body.notes.trim().slice(0, 500) : null,
      upvotes: 0,
      reported_at: new Date().toISOString(),
    }

    const supabase = createServiceRoleClient()
    if (supabase) {
      const { error } = await supabase.from("community_availability").insert(entry)
      if (error) console.error("Availability report error:", error.message)
    }

    return NextResponse.json({ ok: true, id, report: entry })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const id = typeof body?.id === "string" ? body.id.trim() : ""
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    const supabase = createServiceRoleClient()
    if (!supabase) return NextResponse.json({ ok: true })

    const { error: rpcError } = await supabase.rpc("increment_upvotes", { report_id: id })
    if (!rpcError) return NextResponse.json({ ok: true })

    const { data: row, error: fetchError } = await supabase
      .from("community_availability")
      .select("upvotes")
      .eq("id", id)
      .maybeSingle()

    if (fetchError) {
      console.error("Availability upvote read:", fetchError.message)
      return NextResponse.json({ ok: true })
    }
    if (!row) return NextResponse.json({ ok: true })

    const { error: updateError } = await supabase
      .from("community_availability")
      .update({ upvotes: (row.upvotes ?? 0) + 1 })
      .eq("id", id)

    if (updateError) console.error("Availability upvote update:", updateError.message)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
