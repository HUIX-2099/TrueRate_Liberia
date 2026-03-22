import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

function nextId(): string {
  return "FR-" + Date.now().toString().slice(-8) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase()
}

export async function GET() {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    return NextResponse.json({ reports: [] })
  }
  const { data, error } = await supabase
    .from("fraud_reports")
    .select("id, report_type, location, status, created_at")
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ reports: [] })
  return NextResponse.json({ reports: data ?? [] })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const reportType = typeof body?.reportType === "string" ? body.reportType.trim().slice(0, 64) : ""
    const location = typeof body?.location === "string" ? body.location.trim().slice(0, 200) : ""
    const description = typeof body?.description === "string" ? body.description.trim().slice(0, 2000) : ""

    if (!reportType || !location || !description) {
      return NextResponse.json(
        { error: "Report type, location, and description are required" },
        { status: 400 },
      )
    }

    const id = nextId()
    const entry = {
      id,
      report_type: reportType,
      changer_name: typeof body?.changerName === "string" ? body.changerName.trim().slice(0, 128) : "",
      location,
      amount: typeof body?.amount === "string" ? body.amount.trim().slice(0, 32) : "",
      description,
      reporter_name: typeof body?.reporterName === "string" ? body.reporterName.trim().slice(0, 128) : "",
      reporter_phone: typeof body?.reporterPhone === "string" ? body.reporterPhone.trim().slice(0, 32) : "",
      status: "pending",
      created_at: new Date().toISOString(),
    }

    const supabase = createServiceRoleClient()
    if (supabase) {
      const { error } = await supabase.from("fraud_reports").insert(entry)
      if (error) console.error("Supabase fraud report error:", error.message)
    }

    return NextResponse.json({
      ok: true,
      id,
      reference: id,
      message: "Report received. Our team will review within 24-48 hours.",
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
