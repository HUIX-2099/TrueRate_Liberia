/**
 * Web Push Notification Adapter.
 * Uses VAPID keys. Requires WEB_PUSH_VAPID_PUBLIC_KEY and WEB_PUSH_VAPID_PRIVATE_KEY.
 * Falls back to stub in development.
 */

export interface PushSubscriptionRecord {
  endpoint: string
  keys: { auth: string; p256dh: string }
}

export interface PushResult {
  ok: boolean
  endpoint?: string
  error?: string
}

/** In-memory store for subscriptions (replace with DB in production). */
const subscriptions = new Map<string, PushSubscriptionRecord>()

export function registerPushSubscription(sub: PushSubscriptionRecord): void {
  subscriptions.set(sub.endpoint, sub)
}

export function unregisterPushSubscription(endpoint: string): void {
  subscriptions.delete(endpoint)
}

export function getAllSubscriptions(): PushSubscriptionRecord[] {
  return [...subscriptions.values()]
}

/**
 * Send a push notification to a specific subscription.
 * Requires web-push package when VAPID keys are set.
 */
export async function sendPushNotification(
  subscription: PushSubscriptionRecord,
  payload: { title: string; body: string; url?: string; icon?: string }
): Promise<PushResult> {
  if (!process.env.WEB_PUSH_VAPID_PUBLIC_KEY || !process.env.WEB_PUSH_VAPID_PRIVATE_KEY) {
    console.log(`[PUSH STUB] To: ${subscription.endpoint.slice(0, 40)}...\nPayload:`, payload)
    return { ok: true, endpoint: subscription.endpoint }
  }

  try {
    // Dynamic import of web-push (install if needed: pnpm add web-push)
    const webpush = await import("web-push").catch(() => null)
    if (!webpush) {
      console.warn("[PUSH] web-push package not installed. Run: pnpm add web-push")
      return { ok: false, error: "web-push not installed" }
    }

    webpush.default.setVapidDetails(
      `mailto:${process.env.EMAIL_FROM ?? "admin@truerateliberia.com"}`,
      process.env.WEB_PUSH_VAPID_PUBLIC_KEY,
      process.env.WEB_PUSH_VAPID_PRIVATE_KEY
    )

    await webpush.default.sendNotification(
      subscription,
      JSON.stringify({ ...payload, icon: payload.icon ?? "/icons/icon-192.png" })
    )
    return { ok: true, endpoint: subscription.endpoint }
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode
    if (statusCode === 410 || statusCode === 404) {
      // Subscription expired — remove it
      subscriptions.delete(subscription.endpoint)
    }
    return { ok: false, endpoint: subscription.endpoint, error: String(err) }
  }
}

/** Broadcast a push to all registered subscriptions. */
export async function broadcastPush(payload: { title: string; body: string; url?: string }): Promise<PushResult[]> {
  const subs = getAllSubscriptions()
  return Promise.all(subs.map((s) => sendPushNotification(s, payload)))
}
