import type {
  MonitoringAlert,
  AlertRule,
  TrendResult,
  SpikeEvent,
  CorrelationResult,
} from "./types"

const alerts: MonitoringAlert[] = []
let alertIdCounter = 0

function nextId(): string {
  alertIdCounter += 1
  return `alt_${Date.now()}_${alertIdCounter}`
}

export function addAlert(alert: Omit<MonitoringAlert, "id" | "createdAt">): MonitoringAlert {
  const full: MonitoringAlert = {
    ...alert,
    id: nextId(),
    createdAt: new Date().toISOString(),
  }
  alerts.push(full)
  return full
}

export function getAlerts(options: {
  acknowledged?: boolean
  severity?: string
  limit?: number
} = {}): MonitoringAlert[] {
  let list = [...alerts]
  if (options.acknowledged === false) list = list.filter((a) => !a.acknowledgedAt)
  if (options.acknowledged === true) list = list.filter((a) => a.acknowledgedAt)
  if (options.severity) list = list.filter((a) => a.severity === options.severity)
  list.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
  const limit = options.limit ?? 50
  return list.slice(0, limit)
}

export function acknowledgeAlert(id: string): MonitoringAlert | null {
  const a = alerts.find((x) => x.id === id)
  if (!a) return null
  a.acknowledgedAt = new Date().toISOString()
  return a
}

/** Default rules used to generate alerts from engine results. */
export const DEFAULT_RULES: AlertRule[] = [
  {
    id: "spike_percent",
    name: "Price spike (percent)",
    type: "spike",
    enabled: true,
    config: { spikePercentThreshold: 15 },
  },
  {
    id: "spike_zscore",
    name: "Price spike (z-score)",
    type: "spike",
    enabled: true,
    config: { zScoreThreshold: 2.5 },
  },
  {
    id: "trend_down",
    name: "Sustained downward trend",
    type: "trend",
    enabled: true,
    config: { trendDirection: "down" },
  },
  {
    id: "correlation_high",
    name: "High correlation with FX",
    type: "correlation",
    enabled: true,
    config: { correlationThreshold: 0.7 },
  },
]

/** Evaluate trends/spikes/correlation and create alerts per rules. */
export function evaluateAlerts(
  trends: TrendResult[],
  spikes: SpikeEvent[],
  correlations: CorrelationResult[],
  rules: AlertRule[] = DEFAULT_RULES
): MonitoringAlert[] {
  const created: MonitoringAlert[] = []
  const activeRules = rules.filter((r) => r.enabled)

  for (const r of activeRules) {
    if (r.type === "spike" && r.config.spikePercentThreshold != null) {
      for (const s of spikes) {
        if (Math.abs(s.changePercent) >= r.config.spikePercentThreshold!) {
          created.push(
            addAlert({
              type: "spike",
              severity: Math.abs(s.changePercent) >= 25 ? "critical" : "warning",
              title: `Price spike: ${s.commodityName}`,
              message: `${s.changePercent}% change on ${s.date} (${s.previousValue} → ${s.value})`,
              commodityId: s.commodityId,
              commodityName: s.commodityName,
              payload: {
                date: s.date,
                changePercent: s.changePercent,
                value: s.value,
                previousValue: s.previousValue,
              },
            })
          )
        }
      }
    }
    if (r.type === "trend" && r.config.trendDirection === "down") {
      for (const t of trends) {
        if (t.direction === "down" && t.slopePercent < -5) {
          created.push(
            addAlert({
              type: "trend",
              severity: t.slopePercent < -15 ? "critical" : "warning",
              title: `Downward trend: ${t.commodityName}`,
              message: `Trend ${t.slopePercent}% over ${t.periodDays} days. Latest: ${t.latestValue} on ${t.latestDate}.`,
              commodityId: t.commodityId,
              commodityName: t.commodityName,
              payload: {
                slopePercent: t.slopePercent,
                periodDays: t.periodDays,
                latestValue: t.latestValue,
              },
            })
          )
        }
      }
    }
    if (r.type === "correlation" && r.config.correlationThreshold != null) {
      for (const c of correlations) {
        if (Math.abs(c.correlation) >= r.config.correlationThreshold!) {
          created.push(
            addAlert({
              type: "correlation",
              severity: "info",
              title: `FX correlation: ${c.commodityName}`,
              message: `Correlation with USD/LRD: ${c.correlation} (${c.interpretation}). ${c.overlappingPoints} overlapping points.`,
              commodityId: c.commodityId,
              commodityName: c.commodityName,
              payload: {
                correlation: c.correlation,
                interpretation: c.interpretation,
                overlappingPoints: c.overlappingPoints,
              },
            })
          )
        }
      }
    }
  }

  return created
}
