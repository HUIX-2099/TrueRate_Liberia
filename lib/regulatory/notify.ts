import type { RegulationChangeEvent } from "./types"

export type RegulationChangeListener = (event: RegulationChangeEvent) => void

const listeners: RegulationChangeListener[] = []

/** Register a listener for market regulation changes. Returns unsubscribe function. */
export function onRegulationChange(listener: RegulationChangeListener): () => void {
  listeners.push(listener)
  return () => {
    const i = listeners.indexOf(listener)
    if (i >= 0) listeners.splice(i, 1)
  }
}

/** Notify all registered listeners of a regulation change. Used by the store. */
export function notifyRegulationChange(event: RegulationChangeEvent): void {
  for (const fn of listeners) {
    try {
      fn(event)
    } catch (err) {
      console.error("[Regulatory notify]", err)
    }
  }
}

/** Get the default notifier to pass into store methods (notifies listeners). */
export function getDefaultNotifier(): (event: RegulationChangeEvent) => void {
  return notifyRegulationChange
}
