-- TRFN homepage AI signals cache (GET /api/trfn/homepage-signals)
-- Run in Supabase SQL editor if the route should persist cache.

create table if not exists public.trfn_signals_cache (
  id uuid primary key default gen_random_uuid(),
  cache_key text not null,
  signals jsonb not null,
  context jsonb,
  created_at timestamptz not null default now()
);

create index if not exists trfn_signals_cache_key_created_idx
  on public.trfn_signals_cache (cache_key, created_at desc);

-- Optional: restrict to service role only (adjust if you need anon read)
alter table public.trfn_signals_cache enable row level security;
