import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

/** Crowdsourced market prices → Supabase `price_index` (same as /api/price-index/supabase). */
export async function GET() {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY" },
      { status: 500 }
    )
  }

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

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY" },
      { status: 500 }
    )
  }

  const body = await req.json()
  const { data, error } = await supabase.from("price_index").insert(body)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data ?? [])
}
