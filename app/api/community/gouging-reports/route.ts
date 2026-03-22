import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"

function nextId(): string {
  return "GR-" + Date.now().toString().slice(-8) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase()
}

export async function GET() {
  const supabase = createServiceRoleClient()
  if (!supabase) return NextResponse.json({ reports: [] })
  const { data, error } = await supabase
    .from("gouging_reports")
    .select("id, location, status, created_at")
    .order("created_at", { ascending: false })
    .limit(20)
  if (error) {
    console.error("Supabase gouging reports GET:", error.message)
    return NextResponse.json({ reports: [] })
  }
  return NextResponse.json({ reports: data ?? [] })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const location = typeof body?.location === "string" ? body.location.trim().slice(0, 200) : ""
    const description = typeof body?.description === "string" ? body.description.trim().slice(0, 2000) : ""
    if (!location || !description) {
      return NextResponse.json({ error: "Location and description required" }, { status: 400 })
    }
    const id = nextId()
    const entry = {
      id,
      location,
      description,
      amount: typeof body?.amount === "string" ? body.amount.trim().slice(0, 32) : "",
      reporter_name: typeof body?.reporterName === "string" ? body.reporterName.trim().slice(0, 128) : "",
      reporter_phone: typeof body?.reporterPhone === "string" ? body.reporterPhone.trim().slice(0, 32) : "",
      status: "pending",
      created_at: new Date().toISOString(),
    }
    const supabase = createServiceRoleClient()
    if (supabase) {
      const { error } = await supabase.from("gouging_reports").insert(entry)
      if (error) console.error("Supabase gouging reports POST:", error.message)
    }
    return NextResponse.json({ ok: true, id, reference: id })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
