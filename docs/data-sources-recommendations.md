# Recommended Additional Data Sources for TrueRate Liberia

Suggestions to diversify and strengthen FX, inflation, commodity, trade, and news coverage. **API** = machine-readable; **Scrape/Doc** = page or file; **Attribution** = cite only.

---

## Exchange rates (USD/LRD)

| Source | URL / Notes | Type | Use |
|--------|-------------|------|-----|
| **IMF Exchange Rates** | [https://www.imf.org/external/np/fin/data/param_rms_mth.aspx](https://www.imf.org/external/np/fin/data/param_rms_mth.aspx) — or IFS API if subscribed | Scrape / API | Official monthly rates; cross-check with CBL. |
| **ECB (Euro foreign exchange reference rates)** | [https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html) | API (XML/JSON) | LRD may be available; useful for EUR/LRD if needed. |
| **Fixer.io** | [https://fixer.io](https://fixer.io) | API | Free tier; add as another FX feed with parser. |
| **OANDA** | [https://www.oanda.com/currency-converter/](https://www.oanda.com/currency-converter/) | Scrape / API | Market rates; similar role to Xe. |

---

## Inflation / CPI / Macro

| Source | URL / Notes | Type | Use |
|--------|-------------|------|-----|
| **World Bank WDI (World Development Indicators)** | [https://datacatalog.worldbank.org/dataset/world-development-indicators](https://datacatalog.worldbank.org/dataset/world-development-indicators) — API: `api.worldbank.org/v2/country/lbr/indicator/FP.CPI.TOTL` | API | CPI and inflation series; align with LISGIS/CBL. |
| **IMF World Economic Outlook (WEO)** | [https://www.imf.org/en/Publications/WEO](https://www.imf.org/en/Publications/WEO) — WEO database has country inflation | API / Bulk | Inflation forecasts and historical; attribution. |
| **IMF IFS (International Financial Statistics)** | [https://data.imf.org/?sk=4C514D48-B6BA-49ED-8AB9-52B0C1A0179B](https://data.imf.org/?sk=4C514D48-B6BA-49ED-8AB9-52B0C1A0179B) | API / Bulk | CPI, FX; official macro. |
| **African Development Bank (AfDB)** | [https://www.afdb.org/en/countries/west-africa/liberia](https://www.afdb.org/en/countries/west-africa/liberia) — data portal / statistics | Scrape / Doc | Regional context, project data; attribution. |
| **UNECA (UN Economic Commission for Africa)** | [https://www.uneca.org](https://www.uneca.org) — statistical releases | Doc | Africa-wide indicators; optional. |
| **Trading Economics** | Already used in `app/api/liberia-cpi/route.ts` for CPI/inflation | Scrape | Consider adding to `INFLATION_DATA_SOURCES` for attribution. |

---

## Commodity / food prices

| Source | URL / Notes | Type | Use |
|--------|-------------|------|-----|
| **World Bank Pink Sheet (commodity prices)** | [https://www.worldbank.org/en/research/commodity-markets](https://www.worldbank.org/en/research/commodity-markets) | Doc / API | Global rice, oil, etc.; context for local prices. |
| **IFPRI (International Food Policy Research Institute)** | [https://www.ifpri.org/topic/food-prices](https://www.ifpri.org/topic/food-prices) | Doc / Data | Food price and policy; attribution. |
| **USAID FEWS NET** | Already in `lib/inflation-history.ts` | Attribution | No change. |
| **HUMDATA (OCHA)** | [https://data.humdata.org](https://data.humdata.org) — WFP and other humanitarian datasets | API / Bulk | Additional food/price datasets; may have Liberia. |
| **ACAPS** | [https://www.acaps.org/country/liberia](https://www.acaps.org/country/liberia) | Scrape / Doc | Risk and crisis; optional for market risk narrative. |

---

## Trade / imports

| Source | URL / Notes | Type | Use |
|--------|-------------|------|-----|
| **UN Comtrade** | [https://comtradeplus.un.org](https://comtradeplus.un.org) — [API](https://comtradeplus.un.org/Development/API) | API | Official trade by country/commodity; LRD/USD. |
| **ITC Trade Map** | [https://www.trademap.org](https://www.trademap.org) | API / Export | Trade flows and tariffs; complement MoCI. |
| **WTO Statistics** | [https://www.wto.org/english/res_e/statis_e/statis_e.htm](https://www.wto.org/english/res_e/statis_e/statis_e.htm) | Doc / API | Tariffs and trade policy; attribution. |
| **Liberia Revenue Authority (LRA)** | If public bulletins or API exist | API / Doc | Customs/tax context; verify availability. |

---

## News / market narrative

| Source | URL / Notes | Type | Use |
|--------|-------------|------|-----|
| **Daily Observer Liberia** | Check for RSS/feed (e.g. `https://www.liberianobserver.com/feed/` or /category/business/feed/) | RSS | Add to `app/api/news/route.ts` SOURCES. |
| **Heritage Liberia** | Business/editorial; look for RSS | RSS | Same. |
| **World Bank Liberia** | [https://www.worldbank.org/en/country/liberia](https://www.worldbank.org/en/country/liberia) — news/press | Scrape / RSS | Policy and project news. |
| **IMF Liberia** | [https://www.imf.org/en/Countries/LBR](https://www.imf.org/en/Countries/LBR) — press releases | Scrape / RSS | Program and macro news. |
| **CBL press releases** | [https://www.cbl.org.lr](https://www.cbl.org.lr) — news or press section | Scrape / RSS | Official FX and monetary policy. |

---

## Implementation priority

1. **Quick wins (attribution only)**  
   Add **World Bank WDI** and **Trading Economics** to `lib/inflation-history.ts` → `INFLATION_DATA_SOURCES` so methodology and “Data sources” text list them.

2. **FX**  
   Add one more free API (e.g. **Fixer.io** or **IMF** if you can parse) to `lib/api/multi-source-rates.ts` → `RATE_SOURCES` for robustness.

3. **Trade**  
   When building out trade analytics, add **UN Comtrade** (or **ITC Trade Map**) as an optional feed alongside MoCI/ Liberia Single Window.

4. **News**  
   Add 1–2 Liberia-focused RSS feeds (e.g. **Daily Observer**, **CBL** or **World Bank Liberia**) to `app/api/news/route.ts` → `SOURCES`.

5. **Market intelligence dashboard**  
   Add any new live/API sources to `app/api/market-intelligence/sources/route.ts` so the dashboard stays accurate.

---

## Notes

- **APIs**: Prefer official (IMF, World Bank, UN) for macro; check rate limits and terms.
- **Attribution**: Every source used (including scrape-only) should appear in UI and in `INFLATION_DATA_SOURCES` or market-intelligence sources where relevant.
- **CBL/LISGIS first**: For official LRD and CPI, keep CBL and LISGIS as primary; others for cross-check and narrative.
