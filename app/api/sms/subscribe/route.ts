import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length <= 8) return "+231" + digits
  if (digits.startsWith("231")) return "+" + digits
  return "+231" + digits.slice(-8)
}

function resolveFrequency(raw: unknown): "instant" | "daily" | "weekly" {
  if (raw === "instant" || raw === "daily" || raw === "weekly") return raw
  if (raw === "major") return "instant"
  return "daily"
}

export async function GET() {
  const supabase = createServiceRoleClient()
  if (!supabase) return NextResponse.json({ count: 0 })
  const { count, error } = await supabase
    .from("sms_subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("active", true)
  if (error) {
    console.error("SMS subscriptions GET:", error.message)
    return NextResponse.json({ count: 0 })
  }
  return NextResponse.json({ count: count ?? 0 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const rawPhone = typeof body?.phone === "string" ? body.phone.trim() : ""
    if (!rawPhone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }
    const phone = normalizePhone(rawPhone)
    const frequency = resolveFrequency(body?.frequency)
    const alerts = {
      alert_rate_changes: body?.alerts?.rateChanges !== false,
      alert_weekly_report: body?.alerts?.weeklyReport !== false,
      alert_market_news: body?.alerts?.marketNews === true,
    }

    const supabase = createServiceRoleClient()
    if (supabase) {
      const { error } = await supabase
        .from("sms_subscriptions")
        .upsert(
          { phone, frequency, ...alerts, active: true, created_at: new Date().toISOString() },
          { onConflict: "phone" },
        )
      if (error) console.error("SMS subscription error:", error.message)
    }

    return NextResponse.json({
      ok: true,
      phone,
      message: `Subscribed! You'll receive ${frequency} rate alerts at ${phone}.`,
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const rawPhone = typeof body?.phone === "string" ? body.phone.trim() : ""
    if (!rawPhone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 })
    }
    const phone = normalizePhone(rawPhone)
    const supabase = createServiceRoleClient()
    if (supabase) {
      const { error } = await supabase.from("sms_subscriptions").update({ active: false }).eq("phone", phone)
      if (error) console.error("SMS unsubscribe error:", error.message)
    }
    return NextResponse.json({ ok: true, message: "Unsubscribed successfully." })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
