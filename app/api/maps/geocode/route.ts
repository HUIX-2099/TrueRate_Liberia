import { NextResponse } from "next/server"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = Number(searchParams.get("lat"))
  const lng = Number(searchParams.get("lng"))

  if (![lat, lng].every((v) => Number.isFinite(v))) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 })
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return NextResponse.json({ error: "Missing Google Maps API key" }, { status: 500 })
  }

  const params = new URLSearchParams({
    latlng: `${lat},${lng}`,
    key: GOOGLE_MAPS_API_KEY,
  })

  const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 502 })
  }

  const data = await res.json()
  const address = data?.results?.[0]?.formatted_address
  if (!address) {
    return NextResponse.json({ error: "No address found" }, { status: 404 })
  }

  return NextResponse.json({ address })
}
