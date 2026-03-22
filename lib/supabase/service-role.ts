import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Server-only: uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS). Do not import from client components.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ""
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

export function createServiceRoleClient(): SupabaseClient | null {
  if (!url || !serviceRoleKey) return null
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
