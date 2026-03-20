/**
 * Chart accessibility helpers — WCAG 2.1 AA compliance for data visualizations.
 *
 * recharts does not emit full ARIA by default; these helpers generate
 * accessible labels and table fallbacks for screen readers.
 */

export interface DataPoint {
  label: string
  value: number
  unit?: string
}

/**
 * Build an accessible description string for a chart.
 * Used as `aria-label` on the chart container.
 */
export function buildChartAriaLabel(opts: {
  title: string
  dataPoints: DataPoint[]
  trend?: "up" | "down" | "flat"
}): string {
  const { title, dataPoints, trend } = opts
  if (dataPoints.length === 0) return `${title}: no data available`

  const first = dataPoints[0]
  const last = dataPoints[dataPoints.length - 1]
  const trendText =
    trend === "up"
      ? "trending upward"
      : trend === "down"
      ? "trending downward"
      : "stable"

  return `${title}. Data from ${first.label} to ${last.label}, ${trendText}. ${first.label}: ${formatValue(first)}; ${last.label}: ${formatValue(last)}.`
}

function formatValue(point: DataPoint): string {
  return `${point.value.toFixed(2)}${point.unit ? ` ${point.unit}` : ""}`
}

/**
 * Generate HTML for an accessible data table as a visually hidden
 * fallback for recharts/SVG charts. Paste the returned HTML inside
 * a `<div className="sr-only">` next to the chart.
 */
export function buildAccessibleDataTable(opts: {
  caption: string
  headers: string[]
  rows: (string | number)[][]
}): string {
  const { caption, headers, rows } = opts
  const thead = `<tr>${headers.map((h) => `<th scope="col">${h}</th>`).join("")}</tr>`
  const tbody = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")
  return `<table><caption>${caption}</caption><thead>${thead}</thead><tbody>${tbody}</tbody></table>`
}

/**
 * Props to spread on a recharts `<ResponsiveContainer>` wrapper div
 * for WCAG 2.1 compliance.
 */
export function getChartContainerProps(ariaLabel: string): Record<string, string> {
  return {
    role: "img",
    "aria-label": ariaLabel,
    tabIndex: "0",
  }
}

/**
 * Colors that pass WCAG AA 4.5:1 contrast on white/light backgrounds.
 * Use in chart stroke/fill instead of brand colors that may fail contrast.
 */
export const A11Y_CHART_COLORS = {
  primary:    "#1d4ed8", // blue-700
  secondary:  "#15803d", // green-700
  accent:     "#b45309", // amber-700
  danger:     "#b91c1c", // red-700
  neutral:    "#374151", // gray-700
  purple:     "#6d28d9", // violet-700
} as const
