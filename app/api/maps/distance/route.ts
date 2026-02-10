import { NextResponse } from "next/server"

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const originLat = Number(searchParams.get("originLat"))
  const originLng = Number(searchParams.get("originLng"))
  const destLat = Number(searchParams.get("destLat"))
  const destLng = Number(searchParams.get("destLng"))

  if (![originLat, originLng, destLat, destLng].every((v) => Number.isFinite(v))) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 })
  }
  if (
    Math.abs(originLat) > 90 ||
    Math.abs(destLat) > 90 ||
    Math.abs(originLng) > 180 ||
    Math.abs(destLng) > 180
  ) {
    return NextResponse.json({ error: "Coordinates out of range" }, { status: 400 })
  }

  if (GOOGLE_MAPS_API_KEY) {
    const params = new URLSearchParams({
      origins: `${originLat},${originLng}`,
      destinations: `${destLat},${destLng}`,
      key: GOOGLE_MAPS_API_KEY,
    })
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`
    const res = await fetch(url, { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      const element = data?.rows?.[0]?.elements?.[0]
      if (element?.status === "OK") {
        const distanceKm = element.distance?.value ? element.distance.value / 1000 : null
        const durationMinutes = element.duration?.value ? Math.round(element.duration.value / 60) : null
        if (distanceKm !== null && durationMinutes !== null) {
          return NextResponse.json({ distanceKm, durationMinutes, source: "google" })
        }
      }
    }
  }

  const distanceKm = haversineKm(originLat, originLng, destLat, destLng)
  const durationMinutes = Math.max(1, Math.round((distanceKm / 30) * 60))
  return NextResponse.json({ distanceKm, durationMinutes, source: "fallback" })
}
