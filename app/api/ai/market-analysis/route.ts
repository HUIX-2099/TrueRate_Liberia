/**
 * Alias for `POST /api/trfn/analyze` — TRFN AI market analyst (Claude + Supabase context).
 * Segment config must be declared in this file (not re-exported from another route).
 */
export const dynamic = "force-dynamic"
export const revalidate = 0

export { POST } from "../../trfn/analyze/route"
