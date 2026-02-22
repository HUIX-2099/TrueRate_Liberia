/**
 * Regulatory monitoring module – trade policy, price controls, regulation change notifications.
 */

/** Trade policy update (tariffs, quotas, import/export rules, etc.). */
export interface TradePolicyUpdate {
  id: string
  /** Short title. */
  title: string
  /** Description or summary. */
  description: string
  /** Policy type. */
  type: "tariff" | "quota" | "import_restriction" | "export_restriction" | "trade_agreement" | "other"
  /** Affected sector/category (e.g. "Rice", "Cement"). */
  affectedSectors?: string[]
  /** Effective date (YYYY-MM-DD). */
  effectiveDate: string
  /** Source or authority (e.g. "MOC", "CBL"). */
  source?: string
  /** Optional link to official document. */
  sourceUrl?: string
  /** Status. */
  status: "draft" | "published" | "effective" | "suspended" | "revoked"
  createdAt: string
  updatedAt: string
  /** Optional metadata. */
  metadata?: Record<string, unknown>
}

/** Price control policy (ceilings, floors, regulated items). */
export interface PriceControlPolicy {
  id: string
  /** Short title. */
  title: string
  /** Description. */
  description: string
  /** Type of control. */
  type: "ceiling" | "floor" | "fixed" | "band" | "other"
  /** Affected commodity/category. */
  affectedItems: string[]
  /** Numeric bound if applicable (LRD per unit). */
  value?: number
  /** For band: optional high bound. */
  valueHigh?: number
  /** Unit (e.g. "bag", "kg", "USD"). */
  unit?: string
  /** Effective from (YYYY-MM-DD). */
  effectiveFrom: string
  /** Effective to (YYYY-MM-DD), if set. */
  effectiveTo?: string
  /** Authority (e.g. "MOC", "LPRC"). */
  authority?: string
  sourceUrl?: string
  status: "draft" | "active" | "suspended" | "expired"
  createdAt: string
  updatedAt: string
  metadata?: Record<string, unknown>
}

/** Kind of regulation change event. */
export type RegulationChangeKind =
  | "trade_policy_added"
  | "trade_policy_updated"
  | "trade_policy_revoked"
  | "price_control_added"
  | "price_control_updated"
  | "price_control_expired"

/** Event emitted when market regulation changes (for notifications). */
export interface RegulationChangeEvent {
  id: string
  kind: RegulationChangeKind
  /** Reference to the policy (trade policy id or price control id). */
  policyId: string
  /** Human-readable summary for notifications. */
  summary: string
  /** Optional detail. */
  detail?: string
  /** When the change was recorded. */
  createdAt: string
  /** Payload for subscribers (e.g. full policy snapshot). */
  payload?: Record<string, unknown>
}

/** Input to create a trade policy update (id and timestamps added by store). */
export type CreateTradePolicyUpdateInput = Omit<
  TradePolicyUpdate,
  "id" | "createdAt" | "updatedAt"
> &
  Partial<Pick<TradePolicyUpdate, "metadata">>

/** Input to create a price control policy. */
export type CreatePriceControlPolicyInput = Omit<
  PriceControlPolicy,
  "id" | "createdAt" | "updatedAt"
> &
  Partial<Pick<PriceControlPolicy, "metadata">>
