import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

/** GET: latest crowd-sourced / stored price rows from Supabase `price_index`. */
export async function GET() {
  const { data, error } = await supabase
    .from("price_index")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data ?? [])
}

/** POST: insert a crowd-sourced row into `price_index` (Supabase RLS must allow insert for anon or use service role). */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>
    const priceLrd = Number(body.price_lrd)

    if (!body.item_name || body.price_lrd === undefined || body.price_lrd === null || Number.isNaN(priceLrd)) {
      return NextResponse.json({ error: "item_name and price_lrd are required" }, { status: 400 })
    }
    if (priceLrd < 0 || priceLrd > 10_000_000) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 })
    }

    const priceUsd =
      body.price_usd === null || body.price_usd === undefined || body.price_usd === ""
        ? null
        : Number(body.price_usd)

    const { data, error } = await supabase
      .from("price_index")
      .insert({
        item_name: String(body.item_name),
        category: body.category != null ? String(body.category) : undefined,
        price_lrd: priceLrd,
        price_usd: priceUsd !== null && !Number.isNaN(priceUsd) ? priceUsd : null,
        market_location: body.market_location != null ? String(body.market_location) : undefined,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid JSON body"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
