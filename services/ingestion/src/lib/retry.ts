import { config } from "../config";

export async function withRetry<T>(
  fn: () => Promise<T>,
  context: string
): Promise<T> {
  const { maxAttempts, baseMs } = config.retry;
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt === maxAttempts) break;
      const delay = baseMs * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError ?? new Error(`${context}: unknown error after ${maxAttempts} attempts`);
}
