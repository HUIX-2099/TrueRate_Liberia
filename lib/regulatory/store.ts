import type {
  TradePolicyUpdate,
  PriceControlPolicy,
  RegulationChangeEvent,
  CreateTradePolicyUpdateInput,
  CreatePriceControlPolicyInput,
  RegulationChangeKind,
} from "./types"

const tradePolicies: TradePolicyUpdate[] = []
const priceControlPolicies: PriceControlPolicy[] = []
const regulationChangeLog: RegulationChangeEvent[] = []

let tradePolicyIdCounter = 0
let priceControlIdCounter = 0
let regulationEventIdCounter = 0

function nextTradePolicyId(): string {
  tradePolicyIdCounter += 1
  return `tp_${Date.now()}_${tradePolicyIdCounter}`
}

function nextPriceControlId(): string {
  priceControlIdCounter += 1
  return `pc_${Date.now()}_${priceControlIdCounter}`
}

function nextRegulationEventId(): string {
  regulationEventIdCounter += 1
  return `rce_${Date.now()}_${regulationEventIdCounter}`
}

const now = () => new Date().toISOString()

/** Store a trade policy update. Returns the created record and emits a regulation change event. */
export function addTradePolicyUpdate(
  input: CreateTradePolicyUpdateInput,
  notify: (event: RegulationChangeEvent) => void
): TradePolicyUpdate {
  const id = nextTradePolicyId()
  const created: TradePolicyUpdate = {
    ...input,
    id,
    createdAt: now(),
    updatedAt: now(),
    metadata: input.metadata ?? {},
  }
  tradePolicies.push(created)
  const event: RegulationChangeEvent = {
    id: nextRegulationEventId(),
    kind: "trade_policy_added",
    policyId: id,
    summary: `Trade policy: ${input.title}`,
    detail: input.description,
    createdAt: now(),
    payload: { tradePolicy: created },
  }
  regulationChangeLog.push(event)
  notify(event)
  return created
}

/** Update an existing trade policy by id. Emits trade_policy_updated event. */
export function updateTradePolicyUpdate(
  id: string,
  patch: Partial<Omit<TradePolicyUpdate, "id" | "createdAt">>,
  notify: (event: RegulationChangeEvent) => void
): TradePolicyUpdate | null {
  const i = tradePolicies.findIndex((p) => p.id === id)
  if (i < 0) return null
  const updated: TradePolicyUpdate = {
    ...tradePolicies[i],
    ...patch,
    id,
    createdAt: tradePolicies[i].createdAt,
    updatedAt: now(),
  }
  tradePolicies[i] = updated
  const event: RegulationChangeEvent = {
    id: nextRegulationEventId(),
    kind: "trade_policy_updated",
    policyId: id,
    summary: `Trade policy updated: ${updated.title}`,
    detail: patch.description ?? updated.description,
    createdAt: now(),
    payload: { tradePolicy: updated },
  }
  regulationChangeLog.push(event)
  notify(event)
  return updated
}

/** List trade policy updates (optional filters). */
export function getTradePolicyUpdates(options: {
  status?: string
  type?: string
  effectiveFrom?: string
  limit?: number
} = {}): TradePolicyUpdate[] {
  let list = [...tradePolicies]
  if (options.status) list = list.filter((p) => p.status === options.status)
  if (options.type) list = list.filter((p) => p.type === options.type)
  if (options.effectiveFrom)
    list = list.filter((p) => p.effectiveDate >= options.effectiveFrom!)
  list.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
  const limit = options.limit ?? 100
  return list.slice(0, limit)
}

/** Get a single trade policy by id. */
export function getTradePolicyUpdateById(id: string): TradePolicyUpdate | null {
  return tradePolicies.find((p) => p.id === id) ?? null
}

/** Store a price control policy. Emits price_control_added event. */
export function addPriceControlPolicy(
  input: CreatePriceControlPolicyInput,
  notify: (event: RegulationChangeEvent) => void
): PriceControlPolicy {
  const id = nextPriceControlId()
  const created: PriceControlPolicy = {
    ...input,
    id,
    createdAt: now(),
    updatedAt: now(),
    metadata: input.metadata ?? {},
  }
  priceControlPolicies.push(created)
  const event: RegulationChangeEvent = {
    id: nextRegulationEventId(),
    kind: "price_control_added",
    policyId: id,
    summary: `Price control: ${input.title}`,
    detail: input.description,
    createdAt: now(),
    payload: { priceControl: created },
  }
  regulationChangeLog.push(event)
  notify(event)
  return created
}

/** Update a price control policy. Emits price_control_updated event. */
export function updatePriceControlPolicy(
  id: string,
  patch: Partial<Omit<PriceControlPolicy, "id" | "createdAt">>,
  notify: (event: RegulationChangeEvent) => void
): PriceControlPolicy | null {
  const i = priceControlPolicies.findIndex((p) => p.id === id)
  if (i < 0) return null
  const updated: PriceControlPolicy = {
    ...priceControlPolicies[i],
    ...patch,
    id,
    createdAt: priceControlPolicies[i].createdAt,
    updatedAt: now(),
  }
  priceControlPolicies[i] = updated
  const event: RegulationChangeEvent = {
    id: nextRegulationEventId(),
    kind: "price_control_updated",
    policyId: id,
    summary: `Price control updated: ${updated.title}`,
    detail: patch.description ?? updated.description,
    createdAt: now(),
    payload: { priceControl: updated },
  }
  regulationChangeLog.push(event)
  notify(event)
  return updated
}

/** List price control policies (optional filters). */
export function getPriceControlPolicies(options: {
  status?: string
  type?: string
  effectiveOn?: string
  limit?: number
} = {}): PriceControlPolicy[] {
  let list = [...priceControlPolicies]
  if (options.status) list = list.filter((p) => p.status === options.status)
  if (options.type) list = list.filter((p) => p.type === options.type)
  if (options.effectiveOn) {
    const d = options.effectiveOn
    list = list.filter(
      (p) => p.effectiveFrom <= d && (!p.effectiveTo || p.effectiveTo >= d)
    )
  }
  list.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
  const limit = options.limit ?? 100
  return list.slice(0, limit)
}

/** Get a single price control policy by id. */
export function getPriceControlPolicyById(id: string): PriceControlPolicy | null {
  return priceControlPolicies.find((p) => p.id === id) ?? null
}

/** Record a regulation change event (e.g. revoked/expired). Used by store and can be called externally. */
export function recordRegulationChange(
  kind: RegulationChangeKind,
  policyId: string,
  summary: string,
  detail?: string,
  payload?: Record<string, unknown>
): RegulationChangeEvent {
  const event: RegulationChangeEvent = {
    id: nextRegulationEventId(),
    kind,
    policyId,
    summary,
    detail,
    createdAt: now(),
    payload,
  }
  regulationChangeLog.push(event)
  return event
}

/** Get recent regulation change events (for notification polling). */
export function getRecentRegulationChanges(options: {
  since?: string
  kind?: RegulationChangeKind
  limit?: number
} = {}): RegulationChangeEvent[] {
  let list = [...regulationChangeLog]
  if (options.since) list = list.filter((e) => e.createdAt >= options.since!)
  if (options.kind) list = list.filter((e) => e.kind === options.kind)
  list.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
  const limit = options.limit ?? 50
  return list.slice(0, limit)
}
