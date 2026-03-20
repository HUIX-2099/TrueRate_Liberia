/**
 * In-memory store for digest subscribers. Replace with DB in production.
 */

export type DigestFrequency = "daily" | "weekly"

export interface Subscriber {
  email: string
  frequency: DigestFrequency
  subscribedAt: string
}

const subscribers = new Map<string, Subscriber>()

export function addSubscriber(email: string, frequency: DigestFrequency): Subscriber {
  const normalized = email.trim().toLowerCase().slice(0, 128)
  const sub: Subscriber = {
    email: normalized,
    frequency,
    subscribedAt: new Date().toISOString(),
  }
  subscribers.set(normalized, sub)
  return sub
}

export function removeSubscriber(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  return subscribers.delete(normalized)
}

export function getSubscribers(frequency?: DigestFrequency): Subscriber[] {
  const list = [...subscribers.values()]
  if (frequency) return list.filter((s) => s.frequency === frequency)
  return list
}

export function getSubscriber(email: string): Subscriber | undefined {
  return subscribers.get(email.trim().toLowerCase())
}
