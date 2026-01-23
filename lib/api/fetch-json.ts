export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  const contentType = res.headers.get("content-type") ?? ""

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }

  if (!contentType.includes("application/json")) {
    const preview = await res.text()
    throw new Error(
      `Expected JSON but received ${contentType || "unknown content type"}: ${preview.slice(0, 120)}`,
    )
  }

  return res.json() as Promise<T>
}
