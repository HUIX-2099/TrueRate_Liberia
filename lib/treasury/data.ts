export type SecurityType = "T-Bill" | "Bond"
export type SecurityStatus = "Open" | "Upcoming" | "Closed" | "Matured"

export interface TreasurySecurity {
  id: string
  /** Human-readable name, e.g. "91-Day Treasury Bill" */
  name: string
  type: SecurityType
  /** ISIN or internal reference */
  isin: string
  /** Denomination currency */
  currency: "LRD"
  /** Days to maturity for T-Bills; years for bonds */
  tenor: string
  /** Days to maturity (numeric) */
  tenorDays: number
  /** Annualised yield at last auction (%) */
  yield: number
  /** Coupon rate for bonds (% p.a.); 0 for discount T-Bills */
  couponRate: number
  /** Face value per unit (LRD) */
  faceValue: number
  /** Minimum investment amount (LRD) */
  minimumInvestment: number
  /** Total issue size (LRD) */
  issueSize: number
  /** Amount subscribed so far (LRD) */
  amountSubscribed: number
  /** Auction / issue date */
  auctionDate: string
  /** Settlement date */
  settlementDate: string
  /** Maturity date */
  maturityDate: string
  status: SecurityStatus
  /** Issuer */
  issuer: "Central Bank of Liberia"
  /** Interest payment frequency for bonds */
  couponFrequency?: "Semi-Annual" | "Annual" | "Quarterly" | "At Maturity"
  /** Risk-free government security */
  riskLevel: "Sovereign"
  /** Bid-to-cover ratio from last auction */
  bidToCover?: number
  /** Previous auction yield for comparison */
  previousYield?: number
}

export interface AuctionEvent {
  id: string
  securityName: string
  type: SecurityType
  tenor: string
  auctionDate: string
  settlementDate: string
  announcementDate: string
  amount: number
  status: "Scheduled" | "In Progress" | "Completed"
}

export interface YieldCurvePoint {
  tenor: string
  tenorDays: number
  yield: number
  previousYield: number
}

function dateOffset(baseDateStr: string, days: number): string {
  const d = new Date(baseDateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const BASE_DATE = "2026-03-14"

export const TREASURY_SECURITIES: TreasurySecurity[] = [
  {
    id: "tbill-91d-2026-q1",
    name: "91-Day Treasury Bill",
    type: "T-Bill",
    isin: "LR0001001001",
    currency: "LRD",
    tenor: "91 Days",
    tenorDays: 91,
    yield: 6.25,
    couponRate: 0,
    faceValue: 1_000_000,
    minimumInvestment: 5_000_000,
    issueSize: 2_500_000_000,
    amountSubscribed: 2_875_000_000,
    auctionDate: dateOffset(BASE_DATE, -7),
    settlementDate: dateOffset(BASE_DATE, -5),
    maturityDate: dateOffset(BASE_DATE, 84),
    status: "Closed",
    issuer: "Central Bank of Liberia",
    couponFrequency: "At Maturity",
    riskLevel: "Sovereign",
    bidToCover: 1.15,
    previousYield: 6.10,
  },
  {
    id: "tbill-182d-2026-q1",
    name: "182-Day Treasury Bill",
    type: "T-Bill",
    isin: "LR0001001002",
    currency: "LRD",
    tenor: "182 Days",
    tenorDays: 182,
    yield: 7.50,
    couponRate: 0,
    faceValue: 1_000_000,
    minimumInvestment: 5_000_000,
    issueSize: 1_500_000_000,
    amountSubscribed: 1_710_000_000,
    auctionDate: dateOffset(BASE_DATE, -7),
    settlementDate: dateOffset(BASE_DATE, -5),
    maturityDate: dateOffset(BASE_DATE, 175),
    status: "Closed",
    issuer: "Central Bank of Liberia",
    couponFrequency: "At Maturity",
    riskLevel: "Sovereign",
    bidToCover: 1.14,
    previousYield: 7.35,
  },
  {
    id: "tbill-364d-2026-q1",
    name: "364-Day Treasury Bill",
    type: "T-Bill",
    isin: "LR0001001003",
    currency: "LRD",
    tenor: "364 Days",
    tenorDays: 364,
    yield: 8.75,
    couponRate: 0,
    faceValue: 1_000_000,
    minimumInvestment: 5_000_000,
    issueSize: 1_000_000_000,
    amountSubscribed: 1_050_000_000,
    auctionDate: dateOffset(BASE_DATE, -7),
    settlementDate: dateOffset(BASE_DATE, -5),
    maturityDate: dateOffset(BASE_DATE, 357),
    status: "Closed",
    issuer: "Central Bank of Liberia",
    couponFrequency: "At Maturity",
    riskLevel: "Sovereign",
    bidToCover: 1.05,
    previousYield: 8.50,
  },
  {
    id: "tbill-91d-2026-q1-next",
    name: "91-Day Treasury Bill",
    type: "T-Bill",
    isin: "LR0001001004",
    currency: "LRD",
    tenor: "91 Days",
    tenorDays: 91,
    yield: 6.35,
    couponRate: 0,
    faceValue: 1_000_000,
    minimumInvestment: 5_000_000,
    issueSize: 3_000_000_000,
    amountSubscribed: 1_200_000_000,
    auctionDate: dateOffset(BASE_DATE, 7),
    settlementDate: dateOffset(BASE_DATE, 9),
    maturityDate: dateOffset(BASE_DATE, 98),
    status: "Open",
    issuer: "Central Bank of Liberia",
    couponFrequency: "At Maturity",
    riskLevel: "Sovereign",
    previousYield: 6.25,
  },
  {
    id: "tbill-182d-2026-q1-next",
    name: "182-Day Treasury Bill",
    type: "T-Bill",
    isin: "LR0001001005",
    currency: "LRD",
    tenor: "182 Days",
    tenorDays: 182,
    yield: 7.60,
    couponRate: 0,
    faceValue: 1_000_000,
    minimumInvestment: 5_000_000,
    issueSize: 2_000_000_000,
    amountSubscribed: 450_000_000,
    auctionDate: dateOffset(BASE_DATE, 7),
    settlementDate: dateOffset(BASE_DATE, 9),
    maturityDate: dateOffset(BASE_DATE, 189),
    status: "Open",
    issuer: "Central Bank of Liberia",
    couponFrequency: "At Maturity",
    riskLevel: "Sovereign",
    previousYield: 7.50,
  },
  {
    id: "bond-2y-2026",
    name: "2-Year Government Bond",
    type: "Bond",
    isin: "LR0002001001",
    currency: "LRD",
    tenor: "2 Years",
    tenorDays: 730,
    yield: 10.25,
    couponRate: 10.00,
    faceValue: 1_000_000,
    minimumInvestment: 10_000_000,
    issueSize: 5_000_000_000,
    amountSubscribed: 5_750_000_000,
    auctionDate: dateOffset(BASE_DATE, -21),
    settlementDate: dateOffset(BASE_DATE, -19),
    maturityDate: dateOffset(BASE_DATE, 709),
    status: "Closed",
    issuer: "Central Bank of Liberia",
    couponFrequency: "Semi-Annual",
    riskLevel: "Sovereign",
    bidToCover: 1.15,
    previousYield: 10.00,
  },
  {
    id: "bond-3y-2026",
    name: "3-Year Government Bond",
    type: "Bond",
    isin: "LR0002001002",
    currency: "LRD",
    tenor: "3 Years",
    tenorDays: 1095,
    yield: 11.50,
    couponRate: 11.25,
    faceValue: 1_000_000,
    minimumInvestment: 10_000_000,
    issueSize: 3_000_000_000,
    amountSubscribed: 2_100_000_000,
    auctionDate: dateOffset(BASE_DATE, 14),
    settlementDate: dateOffset(BASE_DATE, 16),
    maturityDate: dateOffset(BASE_DATE, 1109),
    status: "Open",
    issuer: "Central Bank of Liberia",
    couponFrequency: "Semi-Annual",
    riskLevel: "Sovereign",
    previousYield: 11.25,
  },
  {
    id: "bond-5y-2026",
    name: "5-Year Government Bond",
    type: "Bond",
    isin: "LR0002001003",
    currency: "LRD",
    tenor: "5 Years",
    tenorDays: 1825,
    yield: 12.75,
    couponRate: 12.50,
    faceValue: 1_000_000,
    minimumInvestment: 10_000_000,
    issueSize: 5_000_000_000,
    amountSubscribed: 5_250_000_000,
    auctionDate: dateOffset(BASE_DATE, -60),
    settlementDate: dateOffset(BASE_DATE, -58),
    maturityDate: dateOffset(BASE_DATE, 1765),
    status: "Closed",
    issuer: "Central Bank of Liberia",
    couponFrequency: "Semi-Annual",
    riskLevel: "Sovereign",
    bidToCover: 1.05,
    previousYield: 12.50,
  },
  {
    id: "bond-7y-2026",
    name: "7-Year Government Bond",
    type: "Bond",
    isin: "LR0002001004",
    currency: "LRD",
    tenor: "7 Years",
    tenorDays: 2555,
    yield: 13.50,
    couponRate: 13.25,
    faceValue: 1_000_000,
    minimumInvestment: 25_000_000,
    issueSize: 3_000_000_000,
    amountSubscribed: 900_000_000,
    auctionDate: dateOffset(BASE_DATE, 28),
    settlementDate: dateOffset(BASE_DATE, 30),
    maturityDate: dateOffset(BASE_DATE, 2583),
    status: "Upcoming",
    issuer: "Central Bank of Liberia",
    couponFrequency: "Semi-Annual",
    riskLevel: "Sovereign",
    previousYield: 13.00,
  },
  {
    id: "bond-10y-2026",
    name: "10-Year Government Bond",
    type: "Bond",
    isin: "LR0002001005",
    currency: "LRD",
    tenor: "10 Years",
    tenorDays: 3650,
    yield: 14.50,
    couponRate: 14.25,
    faceValue: 1_000_000,
    minimumInvestment: 25_000_000,
    issueSize: 2_000_000_000,
    amountSubscribed: 2_200_000_000,
    auctionDate: dateOffset(BASE_DATE, -90),
    settlementDate: dateOffset(BASE_DATE, -88),
    maturityDate: dateOffset(BASE_DATE, 3560),
    status: "Closed",
    issuer: "Central Bank of Liberia",
    couponFrequency: "Semi-Annual",
    riskLevel: "Sovereign",
    bidToCover: 1.10,
    previousYield: 14.00,
  },
]

export const YIELD_CURVE: YieldCurvePoint[] = [
  { tenor: "91D", tenorDays: 91, yield: 6.35, previousYield: 6.10 },
  { tenor: "182D", tenorDays: 182, yield: 7.60, previousYield: 7.35 },
  { tenor: "364D", tenorDays: 364, yield: 8.75, previousYield: 8.50 },
  { tenor: "2Y", tenorDays: 730, yield: 10.25, previousYield: 10.00 },
  { tenor: "3Y", tenorDays: 1095, yield: 11.50, previousYield: 11.25 },
  { tenor: "5Y", tenorDays: 1825, yield: 12.75, previousYield: 12.50 },
  { tenor: "7Y", tenorDays: 2555, yield: 13.50, previousYield: 13.00 },
  { tenor: "10Y", tenorDays: 3650, yield: 14.50, previousYield: 14.00 },
]

export const AUCTION_CALENDAR: AuctionEvent[] = [
  {
    id: "auction-1",
    securityName: "91-Day Treasury Bill",
    type: "T-Bill",
    tenor: "91 Days",
    auctionDate: dateOffset(BASE_DATE, 7),
    settlementDate: dateOffset(BASE_DATE, 9),
    announcementDate: dateOffset(BASE_DATE, 0),
    amount: 3_000_000_000,
    status: "In Progress",
  },
  {
    id: "auction-2",
    securityName: "182-Day Treasury Bill",
    type: "T-Bill",
    tenor: "182 Days",
    auctionDate: dateOffset(BASE_DATE, 7),
    settlementDate: dateOffset(BASE_DATE, 9),
    announcementDate: dateOffset(BASE_DATE, 0),
    amount: 2_000_000_000,
    status: "In Progress",
  },
  {
    id: "auction-3",
    securityName: "3-Year Government Bond",
    type: "Bond",
    tenor: "3 Years",
    auctionDate: dateOffset(BASE_DATE, 14),
    settlementDate: dateOffset(BASE_DATE, 16),
    announcementDate: dateOffset(BASE_DATE, 7),
    amount: 3_000_000_000,
    status: "Scheduled",
  },
  {
    id: "auction-4",
    securityName: "7-Year Government Bond",
    type: "Bond",
    tenor: "7 Years",
    auctionDate: dateOffset(BASE_DATE, 28),
    settlementDate: dateOffset(BASE_DATE, 30),
    announcementDate: dateOffset(BASE_DATE, 21),
    amount: 3_000_000_000,
    status: "Scheduled",
  },
  {
    id: "auction-5",
    securityName: "91-Day Treasury Bill",
    type: "T-Bill",
    tenor: "91 Days",
    auctionDate: dateOffset(BASE_DATE, 21),
    settlementDate: dateOffset(BASE_DATE, 23),
    announcementDate: dateOffset(BASE_DATE, 14),
    amount: 2_500_000_000,
    status: "Scheduled",
  },
  {
    id: "auction-6",
    securityName: "364-Day Treasury Bill",
    type: "T-Bill",
    tenor: "364 Days",
    auctionDate: dateOffset(BASE_DATE, 35),
    settlementDate: dateOffset(BASE_DATE, 37),
    announcementDate: dateOffset(BASE_DATE, 28),
    amount: 1_500_000_000,
    status: "Scheduled",
  },
]

/** Format LRD currency values */
export function formatLRD(value: number): string {
  if (value >= 1_000_000_000) return `L$${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `L$${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000) return `L$${(value / 1_000).toFixed(0)}K`
  return `L$${value.toLocaleString()}`
}

/** Calculate discount price for a T-Bill (zero-coupon) */
export function calcTBillPrice(faceValue: number, yield_pct: number, daysToMaturity: number): number {
  return faceValue / (1 + (yield_pct / 100) * (daysToMaturity / 365))
}

/** Calculate total return for a bond investment */
export function calcBondReturn(
  principal: number,
  couponRate: number,
  years: number
): { totalCoupons: number; totalReturn: number; annualIncome: number } {
  const annualIncome = principal * (couponRate / 100)
  const totalCoupons = annualIncome * years
  const totalReturn = principal + totalCoupons
  return { totalCoupons, totalReturn, annualIncome }
}

/** Summary statistics for the treasury market */
export function getTreasurySummary(securities: TreasurySecurity[]) {
  const open = securities.filter((s) => s.status === "Open")
  const totalIssued = securities
    .filter((s) => s.status === "Closed")
    .reduce((sum, s) => sum + s.issueSize, 0)
  const totalSubscribed = securities
    .filter((s) => s.status === "Closed")
    .reduce((sum, s) => sum + s.amountSubscribed, 0)
  const avgBidToCover =
    securities.filter((s) => s.bidToCover).length > 0
      ? securities.filter((s) => s.bidToCover).reduce((s, sec) => s + (sec.bidToCover ?? 0), 0) /
        securities.filter((s) => s.bidToCover).length
      : 0
  const shortTermYield = securities.find((s) => s.tenorDays === 91)?.yield ?? 0
  const longTermYield = securities.find((s) => s.tenorDays === 3650)?.yield ?? 0

  return {
    openOfferings: open.length,
    totalIssued,
    totalSubscribed,
    avgBidToCover: Number(avgBidToCover.toFixed(2)),
    yieldSpread: Number((longTermYield - shortTermYield).toFixed(2)),
    shortTermYield,
    longTermYield,
  }
}
