/**
 * Haptic feedback utility using Web Vibration API.
 * Silently degrades on devices that don't support it.
 */

type HapticPattern = "light" | "medium" | "heavy" | "success" | "error" | "warning"

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 30,
  heavy: 60,
  success: [30, 20, 30],
  error: [50, 30, 50, 30, 50],
  warning: [30, 20, 60],
}

export function haptic(pattern: HapticPattern = "light"): void {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(PATTERNS[pattern])
    }
  } catch {
    // Silently ignore — vibration API may be unavailable or blocked
  }
}

/** Use on rate refresh to give physical feedback */
export function hapticRateRefresh(): void {
  haptic("light")
}

/** Use on successful actions (cart add, form submit, etc.) */
export function hapticSuccess(): void {
  haptic("success")
}

/** Use on errors or failed actions */
export function hapticError(): void {
  haptic("error")
}
