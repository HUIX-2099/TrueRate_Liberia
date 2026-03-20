import { NextResponse } from "next/server"

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = Number(searchParams.get("lat"))
  const lng = Number(searchParams.get("lng"))
  if (![lat, lng].every((v) => Number.isFinite(v))) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 })
  }
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return NextResponse.json({ error: "Coordinates out of range" }, { status: 400 })
  }

  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "demo") {
    // Return demo data for development
    return NextResponse.json({
      results: [
        {
          id: "demo_1",
          address: "Broad Street, Monrovia",
          rating: 4.8,
          openNow: true,
          lat: lat || 6.3156,
          lng: lng || -10.8074,
        },
        {
          id: "demo_2",
          name: "Quick Cash Bureau - Demo",
          address: "Sinkor, Monrovia",
          rating: 4.6,
          openNow: true,
          lat: (lat || 6.3156) + 0.01,
          lng: (lng || -10.8074) + 0.01,
        }
      ]
    })
  }

  const params = new URLSearchParams({
    location: `${lat},${lng}`,
    rankby: "distance",
    type: "currency_exchange",
    keyword: "money changer",
    key: GOOGLE_MAPS_API_KEY,
  })

  const res = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Places search failed" }, { status: 502 })
  }

  const data = await res.json()
  let results = Array.isArray(data?.results) ? data.results : []

  if (!results.length) {
    const textParams = new URLSearchParams({
      query: "money changer OR currency exchange",
      location: `${lat},${lng}`,
      radius: "5000",
      key: GOOGLE_MAPS_API_KEY,
    })
    const textRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${textParams.toString()}`,
      { cache: "no-store" },
    )
    if (textRes.ok) {
      const textData = await textRes.json()
      results = Array.isArray(textData?.results) ? textData.results : []
    }
  }

  const mapped = results
    .filter((place: any) => place?.geometry?.location)
    .map((place: any) => ({
      id: place.place_id ?? place.name,
      name: place.name ?? "Money Changer",
      address: place.vicinity ?? "",
      rating: typeof place.rating === "number" ? place.rating : null,
      openNow: place.opening_hours?.open_now ?? null,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    }))
    .slice(0, 10)

  return NextResponse.json({ results: mapped })
}
