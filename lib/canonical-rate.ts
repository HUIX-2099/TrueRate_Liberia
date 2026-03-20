/**
 * TrueRate canonical rate — single source of truth for platform-wide rate fallbacks.
 *
 * Goal: One interconnected data foundation so all features (live rate, historical,
 * candles, business risk, regional, predictions) analyze, calculate, and display
 * from the same baseline. No mixed numbers or misinformation — one result for
 * accuracy and professionalism.
 *
 * Use getAggregatedRate() / useLiveRate() for real-time data; use this module
 * only when no live or cached rate is available (e.g. API failure, SSR fallback).
 */

/** Single fallback USD/LRD rate used everywhere when live/cached rate is unavailable. */
export const CANONICAL_FALLBACK_RATE = 183.38

/** Valid range for USD/LRD (sanity checks). */
export const RATE_MIN = 100
export const RATE_MAX = 300

/**
 * Returns the canonical fallback rate. Use when:
 * - All market sources failed and no CachedRate in DB
 * - Client has no cached rate in localStorage
 * - Synthetic data (historical, candles) needs a base rate and no live rate is available
 */
export function getCanonicalFallbackRate(): number {
  return CANONICAL_FALLBACK_RATE
}

/** Clamp a value to valid USD/LRD range; returns canonical fallback if invalid. */
export function clampToValidRate(value: number | null | undefined): number {
  if (value == null || !Number.isFinite(value)) return CANONICAL_FALLBACK_RATE
  if (value >= RATE_MIN && value <= RATE_MAX) return value
  return CANONICAL_FALLBACK_RATE
}
