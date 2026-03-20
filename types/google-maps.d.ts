/* Global type declarations for Google Maps JavaScript API when loaded via script. */
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: google.maps.MapOptions)
      fitBounds(bounds: unknown): void
      setCenter(center: unknown): void
      getCenter(): unknown
    }
    interface MapOptions {
      center?: unknown
      zoom?: number
      [key: string]: unknown
    }
    class Marker {
      constructor(opts?: unknown)
      setMap(map: google.maps.Map | null): void
      addListener(eventName: string, handler: () => void): void
    }
    class InfoWindow {
      constructor(opts?: unknown)
      setContent(content: string | Node): void
      open(mapOrOpts?: google.maps.Map | { map?: google.maps.Map; anchor?: unknown }, anchor?: unknown): void
      close(): void
    }
    namespace event {
      function trigger(instance: unknown, eventName: string): void
    }
    namespace places {
      class PlacesService {
        constructor(mapDiv: HTMLDivElement | google.maps.Map)
        findPlaceFromQuery(
          request: { query: string; fields: string[] },
          callback: (results: unknown[] | null, status: string) => void
        ): void
        nearbySearch(
          request: unknown,
          callback: (results: google.maps.PlaceResult[] | null, status: string) => void
        ): void
      }
      const PlacesServiceStatus: { OK: string; ZERO_RESULTS: string; [key: string]: string }
    }
    interface PlaceResult {
      place_id?: string
      name?: string
      vicinity?: string
      rating?: number
      geometry?: { location?: { lat(): number; lng(): number } }
      opening_hours?: { isOpen?(): boolean }
    }
    namespace geometry {
      namespace spherical {
        function computeDistanceBetween(from: unknown, to: unknown): number
      }
    }
    class Geocoder {
      geocode(
        request: { address?: string; placeId?: string },
        callback: (results: unknown[] | null, status: string) => void
      ): void
    }
    class LatLng {
      constructor(lat: number, lng: number)
    }
    const GeocoderStatus: { OK: string; ERROR: string; [key: string]: string }
    const PlacesServiceStatus: { OK: string; ZERO_RESULTS: string; [key: string]: string }
    namespace SymbolPath {
      const CIRCLE: unknown
      const FORWARD_CLOSED_ARROW: unknown
    }
  }
}
