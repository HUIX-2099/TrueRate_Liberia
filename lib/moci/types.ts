/**
 * Types for data extracted from https://www.moci.gov.lr/
 */

export interface MociNewsItem {
  title: string
  date: string
  url: string
  excerpt?: string
}

export interface MociDocument {
  title: string
  url: string
}

export interface MociBulletinRef {
  title: string
  description: string
  url?: string
}

export interface MociPageData {
  source: string
  fetchedAt: string
  news: MociNewsItem[]
  bulletins: MociBulletinRef[]
  recentDocuments: MociDocument[]
  keyDocuments: MociDocument[]
  commerceTodayPublicationUrl?: string
}

/** Commodity-style data generated from MoCI context (Commerce Today bulletin). */
export interface MociCommodityItem {
  commodityId: string
  name: string
  unit: string
  category: string
  effectiveDate: string
  price: number
  currency: string
  source: string
}

/** Import/trade-style data generated from MoCI context. */
export interface MociImportItem {
  commodityName: string
  declarationDate: string
  volume: number
  unit: string
  valueUsd?: number
  valueLocal?: number
  source: string
}
