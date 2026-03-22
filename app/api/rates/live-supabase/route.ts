import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase service role not configured (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)" },
      { status: 503 }
    )
  }

  try {
    const { data: latest, error: latestError } = await supabase
      .from("exchange_rates")
      .select("*")
      .eq("base_currency", "USD")
      .eq("target_currency", "LRD")
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (latestError) {
      return NextResponse.json({ error: latestError.message }, { status: 500 })
    }

    const { data: history, error: historyError } = await supabase
      .from("exchange_rates")
      .select("*")
      .eq("base_currency", "USD")
      .eq("target_currency", "LRD")
      .order("recorded_at", { ascending: false })
      .limit(30)

    if (historyError) {
      return NextResponse.json({ error: historyError.message }, { status: 500 })
    }

    // If no data yet, fetch live and store it
    if (!latest) {
      const apiKey = process.env.EXCHANGE_RATE_API_KEY
      if (!apiKey) {
        return NextResponse.json({ error: "Missing EXCHANGE_RATE_API_KEY" }, { status: 500 })
      }

      const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`, {
        cache: "no-store",
      })
      const data = (await res.json()) as { conversion_rates?: { LRD?: number } }
      const lrdRate = data.conversion_rates?.LRD

      if (lrdRate != null && typeof lrdRate === "number" && !Number.isNaN(lrdRate)) {
        await supabase.from("exchange_rates").insert({
          base_currency: "USD",
          target_currency: "LRD",
          rate: lrdRate,
          source: "ExchangeRate-API",
        })
      }

      return NextResponse.json({ current: lrdRate ?? null, history: [] })
    }

    return NextResponse.json({
      current: latest.rate,
      history: [...(history ?? [])].reverse(),
      lastUpdated: latest.recorded_at,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
