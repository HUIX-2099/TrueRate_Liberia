import { NextResponse, type NextRequest } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

function nextId(): string {
  return "RA-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase()
}

function resolveClientId(param: string | null): string {
  if (!param?.trim()) return "anonymous"
  return param.trim().slice(0, 64)
}

export async function GET(req: NextRequest) {
  const clientId = resolveClientId(req.nextUrl.searchParams.get("clientId"))
  const supabase = createServiceRoleClient()
  if (!supabase) return NextResponse.json({ alerts: [] })
  const { data, error } = await supabase
    .from("rate_alerts")
    .select("*")
    .eq("client_id", clientId)
    .eq("active", true)
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Rate alerts GET:", error.message)
    return NextResponse.json({ alerts: [] })
  }
  return NextResponse.json({ alerts: data ?? [] })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const targetRate = typeof body?.targetRate === "number" ? body.targetRate : null
    const direction = body?.direction === "above" || body?.direction === "below" ? body.direction : null
    const clientId =
      typeof body?.clientId === "string" ? body.clientId.trim().slice(0, 64) : "anonymous"

    if (!targetRate || !direction || targetRate < 100 || targetRate > 300) {
      return NextResponse.json(
        { error: "Valid targetRate and direction (above/below) required" },
        { status: 400 },
      )
    }

    const id = nextId()
    const entry = {
      id,
      client_id: clientId,
      user_id: typeof body?.userId === "string" ? body.userId.trim().slice(0, 64) : null,
      phone: typeof body?.phone === "string" ? body.phone.trim().slice(0, 32) : null,
      email: typeof body?.email === "string" ? body.email.trim().slice(0, 200) : null,
      target_rate: targetRate,
      direction,
      triggered: false,
      active: true,
      created_at: new Date().toISOString(),
    }

    const supabase = createServiceRoleClient()
    if (supabase) {
      const { error } = await supabase.from("rate_alerts").insert(entry)
      if (error) console.error("Rate alerts POST:", error.message)
    }

    return NextResponse.json({
      ok: true,
      id,
      message: `Alert set! We'll notify you when USD/LRD goes ${direction} L$${targetRate}.`,
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const id = typeof body?.id === "string" ? body.id.trim() : ""
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
    const supabase = createServiceRoleClient()
    if (supabase) {
      const { error } = await supabase.from("rate_alerts").update({ active: false }).eq("id", id)
      if (error) console.error("Rate alerts DELETE:", error.message)
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
