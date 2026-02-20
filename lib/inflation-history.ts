/**
 * Historical CPI and inflation for Liberia.
 * Index base: 2018 = 100 (LISGIS uses December 2018 as reference; CBL reports YoY inflation).
 * Data sources: LISGIS, WFP, FAO, FEWS, ReliefWeb, World Bank RTFP, and Central Bank of Liberia.
 */

export const INFLATION_BASE_YEAR = 2018

export const LISGIS_URL = "https://lisgis.gov.lr/pricestats.php"
export const CBL_CPI_URL = "https://www.cbl.org.lr/publications/document-type/cpi-year-year-rate-inflation"
export const CBL_INFLATION_URL = "https://www.cbl.org.lr/general/inflation-rate"
export const WFP_FOOD_PRICES_URL = "https://data.humdata.org/dataset/wfp-food-prices"
export const WFP_MARKET_ANALYSIS_URL = "https://www.wfp.org/market-analysis"
export const FAO_FPMA_URL = "https://www.fao.org/giews/food-prices/en/"
export const FEWS_NET_URL = "https://fews.net/west-africa"
export const RELIEFWEB_LIBERIA_URL = "https://reliefweb.int/country/lbr"
export const WORLD_BANK_RTFP_LIBERIA_URL = "https://microdata.worldbank.org/index.php/catalog/4498"

/** All data sources for the inflation tracker (name + URL). */
export const INFLATION_DATA_SOURCES: { name: string; url: string }[] = [
  { name: "LISGIS", url: LISGIS_URL },
  { name: "WFP", url: WFP_FOOD_PRICES_URL },
  { name: "FAO", url: FAO_FPMA_URL },
  { name: "FEWS NET", url: FEWS_NET_URL },
  { name: "ReliefWeb", url: RELIEFWEB_LIBERIA_URL },
  { name: "World Bank RTFP", url: WORLD_BANK_RTFP_LIBERIA_URL },
  { name: "Central Bank of Liberia", url: CBL_CPI_URL },
]

export interface InflationDataPoint {
  year: string
  /** CPI index (2018 = 100). */
  cpi: number
  /** Year-on-year inflation (%). */
  inflation: number
}

/**
 * Official-based annual CPI (2018=100) and YoY inflation.
 * 2019–2023: consistent with LISGIS/CBL and WB WDI (national source); 2024–2025 from CBL/LISGIS bulletins.
 */
export const LIBERIA_INFLATION_HISTORY: InflationDataPoint[] = [
  { year: "2018", cpi: 100, inflation: 0 },
  { year: "2019", cpi: 112.4, inflation: 12.4 },
  { year: "2020", cpi: 131.5, inflation: 17.0 },
  { year: "2021", cpi: 141.8, inflation: 7.8 },
  { year: "2022", cpi: 150.6, inflation: 6.2 },
  { year: "2023", cpi: 165.5, inflation: 9.9 },
  { year: "2024", cpi: 180.7, inflation: 9.2 },
  { year: "2025", cpi: 191.5, inflation: 6.0 },
]

/**
 * Reference 2024 price for a 25kg bag of imported rice in Liberia (LISGIS, WFP, ReliefWeb market monitoring).
 * Used to derive 2020 equivalent via CPI (2018=100).
 */
export const REFERENCE_25KG_RICE_LRD_2024 = 3500

/**
 * Approximate 2020 cost (LRD) of "25kg bag of rice + cooking oil + basic groceries for a week".
 * Derived by CPI-adjusting 2024 market levels (rice ~L$ 3,500 in 2024; basket ~L$ 4,400 in 2024)
 * using LISGIS/CBL CPI: 2020 index 131.5, 2024 index 180.7 (2018=100).
 * Sources: LISGIS, WFP, FAO, FEWS, ReliefWeb, World Bank RTFP, CBL.
 */
export function get2020BasketAmountLrd(cpi2020: number, cpi2024: number): number {
  const basket2024 = 4400
  return Math.round((basket2024 * cpi2020) / cpi2024)
}

/**
 * Get CPI series for the inflation tool. Caller can replace the latest year with live LISGIS data.
 */
export function getInflationSeries(overrideLatest?: {
  year: string
  cpi: number
  inflationYoY: number
}): InflationDataPoint[] {
  const base = [...LIBERIA_INFLATION_HISTORY]
  if (!overrideLatest) return base

  const last = base[base.length - 1]
  if (last && overrideLatest.year === last.year) {
    base[base.length - 1] = {
      year: overrideLatest.year,
      cpi: overrideLatest.cpi,
      inflation: overrideLatest.inflationYoY,
    }
    return base
  }

  if (overrideLatest.year > last!.year) {
    base.push({
      year: overrideLatest.year,
      cpi: overrideLatest.cpi,
      inflation: overrideLatest.inflationYoY,
    })
  }
  return base
}
