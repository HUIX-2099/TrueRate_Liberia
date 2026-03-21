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
