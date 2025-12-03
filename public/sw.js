/* Simple offline-first service worker for TrueRate Liberia */
const CACHE_NAME = "truerate-cache-v1"
const PRECACHE = [
  "/",
  "/converter",
  "/analytics",
  "/predictions",
  "/icon.svg",
  "/placeholder-logo.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  const req = event.request
  // Only handle GET
  if (req.method !== "GET") return

  // Network-first for API calls, cache-first for others
  const isApi = new URL(req.url).pathname.startsWith("/api/")

  if (isApi) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone))
          return res
        })
        .catch(() => caches.match(req))
    )
    return
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          const resClone = networkRes.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone))
          return networkRes
        })
        .catch(() => cached)

      return cached || fetchPromise
    })
  )
})
