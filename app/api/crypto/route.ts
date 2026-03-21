import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd&include_24hr_change=true",
    { cache: "no-store" }
  )
  const data = await res.json()
  return NextResponse.json(data)
}
