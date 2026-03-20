# TrueRate data architecture — one result goal

TrueRate is built so **all data is interconnected**: one foundation for analysis, calculation, and real-time results. The platform aims for **one result goal** — no mixed numbers or misinformation, for accuracy and professionalism.

## Single source of truth for rates

- **Live rate (server):** `getAggregatedRate()` in `lib/api/multi-source-rates.ts`  
  - Aggregates market sources (Xe, Exchange Rate API, etc.) and CBL official.  
  - Writes to DB `CachedRate` on success.  
  - When all sources fail and there is no cached rate, it uses the **canonical fallback** so the API never returns inconsistent or arbitrary numbers.

- **Canonical fallback:** `lib/canonical-rate.ts`  
  - One constant used everywhere when no live or cached rate is available.  
  - Used by: live-rate context, multi-source aggregation, candles, business-risk, regional, predictions, exchange-rates, and any UI fallback.  
  - Ensures the same number appears across the app when live data is unavailable.

- **Client (UI):** `useLiveRate()` from `lib/live-rate-context.tsx`  
  - Prefer this for “current rate” in components so all UI shows the same live (or canonical fallback) value.  
  - Avoid duplicate `fetch('/api/rates/live')` or other localStorage keys for “current rate” to prevent drift.

## Data flow

1. **Real-time:** APIs and UI use `getAggregatedRate()` / `useLiveRate()` → one live number (or last-known from DB, then canonical fallback).  
2. **Calculations:** Candles, business risk, regional, price index, and predictions use the aggregated rate (or canonical fallback) so analytics share the same baseline.  
3. **Display:** Components that need “current rate” use `useLiveRate().effectiveRate` (or `rate`) so the platform displays one consistent result.

## Summary

- **One fallback:** `lib/canonical-rate.ts` — single constant, no scattered magic numbers.  
- **One live source:** `getAggregatedRate()` → `/api/rates/live` → `LiveRateProvider` / `useLiveRate()`.  
- **One result goal:** Interconnected data, same baseline for analysis and display, for accuracy and professionalism.
