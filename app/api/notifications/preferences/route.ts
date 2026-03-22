import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

function getClientId(request: Request): string {
  const header = request.headers.get("x-notification-client-id")
  if (header) return header.slice(0, 64)
  return "anonymous"
}

export async function GET(request: Request) {
  const clientId = getClientId(request)
  const supabase = createServiceRoleClient()
  if (!supabase) return NextResponse.json({ prefs: null })

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("client_id", clientId)
    .maybeSingle()

  if (error) console.error("Supabase notification preferences GET:", error.message)
  return NextResponse.json({ prefs: data ?? null })
}

export async function POST(request: Request) {
  try {
    const clientId = getClientId(request)
    const body = await request.json()

    const prefs = {
      client_id: clientId,
      rate_above: typeof body?.rateAbove === "number" ? body.rateAbove : null,
      rate_below: typeof body?.rateBelow === "number" ? body.rateBelow : null,
      move_up_pct: typeof body?.moveUpPct === "number" ? body.moveUpPct : null,
      move_down_pct: typeof body?.moveDownPct === "number" ? body.moveDownPct : null,
      digest: ["none", "daily", "weekly"].includes(body?.digest) ? body.digest : "none",
      digest_email: typeof body?.digestEmail === "string" ? body.digestEmail.slice(0, 200) : null,
      phone: typeof body?.phone === "string" ? body.phone.slice(0, 32) : null,
      push_enabled: body?.pushEnabled === true,
      updated_at: new Date().toISOString(),
    }

    const supabase = createServiceRoleClient()
    if (supabase) {
      const { error } = await supabase.from("notification_preferences").upsert(prefs, { onConflict: "client_id" })
      if (error) console.error("Supabase notification preferences POST:", error.message)
    }

    return NextResponse.json({ ok: true, prefs })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
