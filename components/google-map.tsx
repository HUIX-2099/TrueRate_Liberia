"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { importLibrary, setOptions } from "@googlemaps/js-api-loader"

interface GoogleMapMarker {
  id: string
  name: string
  lat: number
  lng: number
  label?: string
}

interface GoogleMapProps {
  markers: GoogleMapMarker[]
  center?: { lat: number; lng: number }
  zoom?: number
  className?: string
  useUserLocation?: boolean
  onReady?: (map: google.maps.Map, userLocation: { lat: number; lng: number } | null) => void
}

export function GoogleMap({
  markers,
  center,
  zoom = 12,
  className,
  useUserLocation = false,
  onReady,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "demo"
  const fallbackCenter = useMemo(() => {
    if (center) return center
    if (userLocation) return userLocation
    const first = markers[0]
    return first ? { lat: first.lat, lng: first.lng } : { lat: 6.3156, lng: -10.8074 }
  }, [center, markers, userLocation])

  useEffect(() => {
    if (typeof window === "undefined") return
    const previousHandler = (window as typeof window & { gm_authFailure?: () => void }).gm_authFailure
    ;(window as typeof window & { gm_authFailure?: () => void }).gm_authFailure = () => {
      setStatus("error")
      setErrorMessage(
        "ApiProjectMapError: The API key or project could not be resolved. Create a new API key, enable billing, and add localhost to referrer restrictions in Google Cloud Console."
      )
      if (previousHandler) previousHandler()
    }
    return () => {
      if (previousHandler) {
        ;(window as typeof window & { gm_authFailure?: () => void }).gm_authFailure = previousHandler
      } else {
        delete (window as typeof window & { gm_authFailure?: () => void }).gm_authFailure
      }
    }
  }, [])

  useEffect(() => {
    if (!useUserLocation || typeof window === "undefined" || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        // Keep fallback center when location is unavailable.
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
    )
  }, [useUserLocation])

  useEffect(() => {
    if (!apiKey || apiKey === "demo") {
      setStatus("error")
      setErrorMessage("Google Maps API key is missing. Maps will show in demo mode.")
      return
    }

    let isMounted = true
    setOptions({
      apiKey,
      version: "weekly",
      libraries: ["places", "geometry"],
    })

    Promise.all([
      importLibrary("maps"),
      importLibrary("places"),
      importLibrary("geometry"),
    ])
      .then(() => {
        if (!isMounted || !mapRef.current) return
        const map = new google.maps.Map(mapRef.current, {
          center: fallbackCenter,
          zoom,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        })
        mapInstanceRef.current = map
        setStatus("ready")
        // Trigger resize so map fills container (fixes display on tab focus / responsive)
        setTimeout(() => google.maps.event.trigger(map, "resize"), 100)
        if (onReady && mapInstanceRef.current) {
          onReady(mapInstanceRef.current, userLocation)
        }
      })
      .catch((error) => {
        console.error("Google Maps failed to load:", error)
        if (!isMounted) return
        setStatus("error")
        const msg = String(error?.message ?? "")
        if (msg.includes("ApiProjectMapError") || msg.includes("ApiProject")) {
          setErrorMessage(
            "ApiProjectMapError: The API key or project could not be resolved. Create a new API key in Google Cloud Console, enable billing, and add localhost to referrer restrictions."
          )
        } else {
          setErrorMessage("Failed to load Google Maps. Verify API key, billing, and enabled APIs.")
        }
      })

    return () => {
      isMounted = false
    }
  }, [apiKey, fallbackCenter, onReady, userLocation, zoom])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || status !== "ready") return

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    const infoWindow = new google.maps.InfoWindow()
    if (userLocation) {
      const userMarker = new google.maps.Marker({
        map,
        position: userLocation,
        title: "Your location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#2563eb",
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 6,
        },
      })
      markersRef.current.push(userMarker)
    }
    markers.forEach((marker) => {
      const gMarker = new google.maps.Marker({
        map,
        position: { lat: marker.lat, lng: marker.lng },
        title: marker.name,
        label: marker.label ? { text: marker.label, className: "map-label" } : undefined,
      })
      gMarker.addListener("click", () => {
        const container = document.createElement("div")
        const nameEl = document.createElement("div")
        nameEl.style.fontWeight = "600"
        nameEl.textContent = marker.name
        const labelEl = document.createElement("div")
        labelEl.style.color = "#64748b"
        labelEl.textContent = marker.label ?? ""
        container.appendChild(nameEl)
        container.appendChild(labelEl)
        infoWindow.setContent(container)
        infoWindow.open({ anchor: gMarker, map })
      })
      markersRef.current.push(gMarker)
    })

    if (userLocation) {
      map.setCenter(userLocation)
    } else if (markers.length) {
      map.setCenter({ lat: markers[0].lat, lng: markers[0].lng })
    }
    if (onReady && map) {
      onReady(map, userLocation)
    }
  }, [markers, onReady, status, userLocation])

  if (status === "error") {
    return (
      <div className={`flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center text-sm text-muted-foreground ${className ?? ""}`}>
        <p className="font-medium">{errorMessage ?? "Map unavailable."}</p>
        <p className="text-xs max-w-md">
          Fix: <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Cloud Console</a> → Create/verify project → Enable Maps JavaScript API → Create API key → Add <code className="rounded bg-muted px-1">http://localhost:3000/*</code> to referrers → Enable billing.
        </p>
      </div>
    )
  }

  return (
    <div className={`relative w-full min-h-[300px] block ${className ?? ""}`}>
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground bg-muted/30 z-10">
          Loading map…
        </div>
      )}
      <div ref={mapRef} className="absolute inset-0 w-full min-h-[300px]" />
    </div>
  )
}
