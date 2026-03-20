/**
 * Indicative tuition and cost data for Liberian universities.
 * Verify with each institution before making financial decisions.
 * Amounts in USD (typical billing); convert to LRD using live rate in UI.
 */

export const STUDENT_BUDGET_SCHOOLS = [
  { id: "ul", name: "University of Liberia", short: "UL", location: "Monrovia", type: "public" },
  { id: "cuttington", name: "Cuttington University", short: "Cuttington", location: "Suakoko, Bong County", type: "private" },
  { id: "stella-maris", name: "Stella Maris Polytechnic", short: "Stella Maris", location: "Monrovia", type: "private" },
] as const

export type SchoolId = (typeof STUDENT_BUDGET_SCHOOLS)[number]["id"]

export interface TuitionBreakdownItem {
  label: string
  amountUSD: number
  notes?: string
}

/** Indicative tuition per semester (USD). Ranges reflect typical undergrad; verify with registrar. */
export const TUITION_BY_SCHOOL: Record<
  SchoolId,
  { minUSD: number; maxUSD: number; breakdown: TuitionBreakdownItem[] }
> = {
  ul: {
    minUSD: 75,
    maxUSD: 200,
    breakdown: [
      { label: "Tuition (undergrad, per semester)", amountUSD: 100, notes: "Varies by college/credits" },
      { label: "Registration / admin fees", amountUSD: 25 },
      { label: "ID / student fees", amountUSD: 10 },
    ],
  },
  cuttington: {
    minUSD: 400,
    maxUSD: 900,
    breakdown: [
      { label: "Tuition (undergrad, per semester)", amountUSD: 550, notes: "Varies by program and credits" },
      { label: "Registration fee", amountUSD: 50 },
      { label: "Technology / lab fees", amountUSD: 30 },
      { label: "Student activity fee", amountUSD: 20 },
    ],
  },
  "stella-maris": {
    minUSD: 300,
    maxUSD: 700,
    breakdown: [
      { label: "Tuition (undergrad, per semester)", amountUSD: 450, notes: "Varies by department" },
      { label: "Registration fee", amountUSD: 40 },
      { label: "Lab / practical fees", amountUSD: 25 },
      { label: "Student services", amountUSD: 15 },
    ],
  },
}

/** Default transport: one-way trip cost in LRD (Monrovia area vs Bong). */
export const TRANSPORT_DEFAULTS: Record<SchoolId, { oneWayLRD: number; note: string }> = {
  ul: { oneWayLRD: 75, note: "Shared taxi/bus within Monrovia; varies by route" },
  cuttington: { oneWayLRD: 0, note: "On-campus or long-distance; enter your own estimate" },
  "stella-maris": { oneWayLRD: 75, note: "Shared taxi/bus within Monrovia" },
}

/** Typical semester length in months for monthly breakdown. */
export const SEMESTER_MONTHS = 4
