declare module "web-push" {
  interface SendResult {
    statusCode: number
    body: string
    headers: Record<string, string>
  }

  interface PushSubscription {
    endpoint: string
    keys: { auth: string; p256dh: string }
  }

  function setVapidDetails(subject: string, publicKey: string, privateKey: string): void
  function sendNotification(
    subscription: PushSubscription,
    payload?: string | Buffer | null,
    options?: Record<string, unknown>
  ): Promise<SendResult>

  export default { setVapidDetails, sendNotification }
}
