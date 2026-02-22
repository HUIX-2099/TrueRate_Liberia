/**
 * Base URL for server-side fetch to own API routes.
 * Relative URLs like "/api/rates/live" may not resolve correctly in RSC;
 * use getServerApiUrl(path) to get an absolute URL.
 */
export function getServerApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  )
}

export function getServerApiUrl(path: string): string {
  const base = getServerApiBaseUrl().replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}
