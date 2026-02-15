/* Performance-optimized service worker for TrueRate Liberia */
const CACHE_NAME = "truerate-cache-v3"
const STATIC_CACHE = "truerate-static-v1"
const API_CACHE = "truerate-api-v1"

// Cache different types of resources with different strategies
const PRECACHE = [
  "/",
  "/rates",
  "/converter",
  "/analytics",
  "/map",
  "/tools",
  "/liberia-market",
  "/offline",
  "/predictions",
  "/icons/logo-192.png",
  "/placeholder-logo.png",
  "/manifest.ts",
]

// Static assets that rarely change
const STATIC_ASSETS = [
  "/_next/static/",
  "/fonts/",
  "/images/",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)),
      caches.open(API_CACHE)
    ]).then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(
        keys.filter((k) => ![CACHE_NAME, STATIC_CACHE, API_CACHE].includes(k))
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  const req = event.request
  if (req.method !== "GET") return

  const url = new URL(req.url)
  const isApi = url.pathname.startsWith("/api/")
  const isNavigate = req.mode === "navigate"
  const isStatic = STATIC_ASSETS.some(asset => url.pathname.startsWith(asset))

  // API calls: Network-first with 5-minute cache
  if (isApi) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const resClone = res.clone()
            caches.open(API_CACHE).then((cache) => {
              const responseToCache = new Response(resClone.body, {
                status: resClone.status,
                statusText: resClone.statusText,
                headers: {
                  ...Object.fromEntries(resClone.headers),
                  'sw-cache-timestamp': Date.now().toString()
                }
              })
              cache.put(req, responseToCache)
            })
          }
          return res
        })
        .catch(() => {
          return caches.open(API_CACHE).then(async (cache) => {
            const cached = await cache.match(req)
            if (cached) {
              const cacheTimestamp = cached.headers.get('sw-cache-timestamp')
              if (cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < 5 * 60 * 1000) {
                return cached
              }
            }
            return cache.match('/offline')
          })
        })
    )
    return
  }

  // Navigation requests: Network-first with offline fallback
  if (isNavigate) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const resClone = res.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(req, resClone))
          }
          return res
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("/offline")))
    )
    return
  }

  // Static assets: Cache-first strategy
  if (isStatic) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached
        return fetch(req).then((res) => {
          if (res.ok) {
            const resClone = res.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(req, resClone))
          }
          return res
        })
      })
    )
    return
  }

  // Default: Stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((networkRes) => {
        if (networkRes.ok) {
          const resClone = networkRes.clone()
          caches.open(STATIC_CACHE).then((cache) => cache.put(req, resClone))
        }
        return networkRes
      })

      return cached || fetchPromise
    })
  )
})
