import {
  PLATFORM_FEE_PERCENT,
  PLATFORM_FEE_MIN_USD,
  DELIVERY_FEE_USD,
} from "./constants"
import type { FeeBreakdown } from "./types"

export interface CartLine {
  priceUsd: number
  quantity: number
}

/**
 * Compute fee breakdown for a cart (subtotal, platform fee, delivery, total).
 */
export function computeFeeBreakdown(
  lines: CartLine[],
  fxRate: number,
  options?: { deliveryFeeUsd?: number }
): FeeBreakdown {
  const subtotalUsd = lines.reduce(
    (sum, l) => sum + l.priceUsd * l.quantity,
    0
  )
  const platformFeeUsd = Math.max(
    (subtotalUsd * PLATFORM_FEE_PERCENT) / 100,
    PLATFORM_FEE_MIN_USD
  )
  const deliveryFeeUsd = options?.deliveryFeeUsd ?? DELIVERY_FEE_USD
  const taxUsd = 0
  const totalUsd = subtotalUsd + platformFeeUsd + deliveryFeeUsd + taxUsd
  const totalLrd = Math.round(totalUsd * fxRate)

  return {
    subtotalUsd,
    platformFeeUsd,
    deliveryFeeUsd,
    taxUsd,
    totalUsd,
    fxRate,
    totalLrd,
  }
}
