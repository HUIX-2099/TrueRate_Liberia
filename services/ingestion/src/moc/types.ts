/**
 * Expected shapes from Ministry of Commerce Liberia API.
 * Adapt these to the actual MoC response format.
 */

export interface MoCCommodityPriceItem {
  commodityId?: string;
  commodityCode?: string;
  name?: string;
  unit?: string;
  category?: string;
  date?: string;
  effectiveDate?: string;
  price?: number;
  currency?: string;
}

export interface MoCCommodityResponse {
  data?: MoCCommodityPriceItem[];
  prices?: MoCCommodityPriceItem[];
  items?: MoCCommodityPriceItem[];
}

export interface MoCImportItem {
  id?: string;
  declarationId?: string;
  portCode?: string;
  portName?: string;
  commodityCode?: string;
  commodityId?: string;
  commodityName?: string;
  date?: string;
  declarationDate?: string;
  volume?: number;
  unit?: string;
  valueLocal?: number;
  valueLrd?: number;
  valueUsd?: number;
  tariffCode?: string;
  tariffAmount?: number;
}

export interface MoCImportResponse {
  data?: MoCImportItem[];
  declarations?: MoCImportItem[];
  imports?: MoCImportItem[];
}
