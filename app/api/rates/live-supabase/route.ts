import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY
  const supabase = getSupabaseServerClient()
  if (!apiKey) {
    return NextResponse.json({ error: "Missing EXCHANGE_RATE_API_KEY" }, { status: 500 })
  }
  if (!supabase) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY" },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`, {
      cache: "no-store",
    })
    const data = await res.json()
    const lrdRate = data.conversion_rates?.LRD

    if (lrdRate) {
      await supabase.from("exchange_rates").insert({
        base_currency: "USD",
        target_currency: "LRD",
        rate: lrdRate,
        source: "ExchangeRate-API",
      })
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

    return NextResponse.json({ current: lrdRate ?? null, history: history ?? [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
