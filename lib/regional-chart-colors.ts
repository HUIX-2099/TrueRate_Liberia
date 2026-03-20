/**
 * Regional rate chart colors — stable mapping so the same county
 * always gets the same color (widget, analytics, any view).
 */

export const REGIONAL_CHART_COLORS = [
  "var(--regional-chart-1)",
  "var(--regional-chart-2)",
  "var(--regional-chart-3)",
  "var(--regional-chart-4)",
  "var(--regional-chart-5)",
  "var(--regional-chart-6)",
  "var(--regional-chart-7)",
] as const

/**
 * Stable index 0..6 from county name so color is consistent across pages and time.
 * Same county name => same color everywhere.
 */
export function getRegionalChartColorIndex(county: string): number {
  let n = 0
  const s = String(county).trim()
  for (let i = 0; i < s.length; i++) n += s.charCodeAt(i)
  return Math.abs(n) % REGIONAL_CHART_COLORS.length
}

/**
 * CSS variable string for the bar fill (e.g. "var(--regional-chart-1)").
 */
export function getRegionalChartColor(county: string): string {
  return REGIONAL_CHART_COLORS[getRegionalChartColorIndex(county)]
}
