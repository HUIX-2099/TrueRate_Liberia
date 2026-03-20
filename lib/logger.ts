/**
 * Centralized logging for API requests and errors.
 * Use for request logs, service status, and failure tracking.
 */

export type LogLevel = "info" | "warn" | "error"

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  service?: string
  path?: string
  statusCode?: number
  durationMs?: number
  error?: string
  metadata?: Record<string, unknown>
}

const logBuffer: LogEntry[] = []
const MAX_BUFFER = 200

function emit(entry: LogEntry): void {
  logBuffer.push(entry)
  if (logBuffer.length > MAX_BUFFER) logBuffer.shift()
  const out = `[${entry.timestamp}] [${entry.level}] ${entry.service ?? "app"} ${entry.message}${entry.error ? ` - ${entry.error}` : ""}`
  if (entry.level === "error") console.error(out, entry.metadata ?? "")
  else if (entry.level === "warn") console.warn(out, entry.metadata ?? "")
  else console.info(out)
}

export function logRequest(params: {
  method: string
  path: string
  statusCode: number
  durationMs: number
  service?: string
}): void {
  emit({
    level: params.statusCode >= 500 ? "error" : params.statusCode >= 400 ? "warn" : "info",
    message: `${params.method} ${params.path}`,
    timestamp: new Date().toISOString(),
    service: params.service,
    path: params.path,
    statusCode: params.statusCode,
    durationMs: params.durationMs,
  })
}

export function logError(params: {
  message: string
  service?: string
  error?: unknown
  metadata?: Record<string, unknown>
}): void {
  emit({
    level: "error",
    message: params.message,
    timestamp: new Date().toISOString(),
    service: params.service,
    error: params.error instanceof Error ? params.error.message : String(params.error),
    metadata: params.metadata,
  })
}

export function getRecentLogs(options: { level?: LogLevel; limit?: number } = {}): LogEntry[] {
  let list = [...logBuffer]
  if (options.level) list = list.filter((e) => e.level === options.level)
  list.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
  return list.slice(0, options.limit ?? 50)
}
