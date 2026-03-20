# TrueRate Liberia — Ministry Partnership & Data Roadmap  
## Phases 1–6: From Permission to National Fintech Role

This roadmap ties **partnership, data, and product phases** to deliverables and repo artifacts.

---

## Phase 1 — Permission & Data-Sharing Relationship (Month 1)

**Goal:** Obtain permission and establish data-sharing relationship with the Ministry of Commerce and Industry (MoCI).

### Activities
- Prepare formal partnership proposal  
- Submit data access request letter  
- Define data usage purpose (fintech analytics, verification, market transparency)  
- Sign Memorandum of Understanding (MoU)  
- Review compliance requirements  
- Define data privacy framework  

### Deliverables (in repo)

| Deliverable | Location |
|-------------|----------|
| **Partnership proposal** | [partnership-proposal.md](./partnership-proposal.md) |
| **Data access request letter** | [data-access-request-letter.md](./data-access-request-letter.md) |
| **Data sharing agreement (outline)** | [data-sharing-agreement.md](./data-sharing-agreement.md) |
| **Data governance policy** | [data-governance-policy.md](./data-governance-policy.md) |
| **Legal compliance checklist** | [legal-compliance-checklist.md](./legal-compliance-checklist.md) |

### Outcome
- ✔ Legal access to official commerce data  
- ✔ Institutional credibility for TrueRate  

---

## Phase 2 — Data Requirements & System Design (Month 2–3)

**Goal:** Define what data TrueRate needs and how it will flow.

### Activities
- Identify priority data sources (business registration, commodity prices, trade stats, licensing, aggregated complaints)  
- Technical design: API integration plan, data request formats, database schema, validation rules, security architecture  

### Deliverables (in repo)

| Deliverable | Location |
|-------------|----------|
| **Priority data sources & formats** | [data-requirements.md](./data-requirements.md) |
| **System architecture diagram** | [../architecture/system-architecture-diagram.md](../architecture/system-architecture-diagram.md), [../architecture/system-architecture.md](../architecture/system-architecture.md) |
| **Data pipeline design** | [../architecture/data-pipeline-design.md](../architecture/data-pipeline-design.md) |
| **Data schema overview** | [../architecture/data-schema-overview.md](../architecture/data-schema-overview.md) |
| **Full database schema** | [../architecture/database-schema.sql](../architecture/database-schema.sql) |

### Outcome
- ✔ Clear data integration blueprint  

---

## Phase 3 — Data Collection Infrastructure (Month 3–5)

**Goal:** Build system to receive and store ministry data.

### Activities
- API connection or scheduled data uploads  
- Automated data ingestion scripts  
- Data cleaning & normalization  
- Secure storage infrastructure  
- Audit logging  

### Features / Repo
- **Ingestion service:** `services/ingestion/` (commodity + trade; extend for licensing/complaints when agreed)  
- **Cron/sync:** `app/api/cron/sync/route.ts`, scheduler in ingestion  
- **Data flow:** [../architecture/data-flow.md](../architecture/data-flow.md)  

### Outcome
- ✔ Reliable data pipeline running  

---

## Phase 4 — Core Platform Features (Month 5–7)

**Goal:** Turn data into real user features.

### Features
- **Business verification:** Verified changer badge, business legitimacy checks, license status  
- **Market intelligence dashboard:** Commodity price tracking, market demand indicators, trade trends  
- **Risk monitoring:** Fraud risk scoring, complaint tracking indicators  

### Repo (existing / to extend)
- Market intelligence: `app/market-intelligence/`, `lib/price-monitoring/`, `lib/trade-analytics/`  
- MOCI integration: `lib/moci/`, `app/api/moci/`  
- Government/audit: `app/api/government/audit-logs/`  

### Outcome
- ✔ Data visible and useful to users  

---

## Phase 5 — Advanced Analytics & AI Insights (Month 7–9)

**Goal:** Use data for predictive fintech intelligence.

### Features
- Exchange rate demand forecasting  
- Cost of living index (LRD vs commodity prices)  
- SME market insights  
- Price volatility alerts  
- Business risk ratings  

### Repo (existing / to extend)
- Predictions: `app/api/rates/predictions/`, `lib/monitoring/commodity-engine/`  
- Cost of living: `lib/cost-of-living/`, `app/api/inflation/`, `app/tools/inflation/`  
- Trade analytics: `lib/trade-analytics/`, `app/api/trade-analytics/`  

### Outcome
- ✔ TrueRate becomes a market intelligence platform  

---

## Phase 6 — Public Transparency & Growth (Month 9–12)

**Goal:** Scale impact and build national adoption.

### Activities
- Public economic reports  
- SME financial insights portal  
- Investor market data dashboards  
- Government data collaboration expansion  
- Integration with Central Bank (future phase)  

### Outcome
- ✔ National fintech infrastructure role  

---

## Parallel track: University research partnership

To support **data verification**, **student research**, and **CBL market intelligence**, TrueRate can engage a prestige university (economics/finance) in a structured project: students analyze and verify government data against real-time data for **market risk**, **price stability**, **cost of living & affordability**, **commodity price trends**, and **import volume trends**. The class/group is credited; the University fosters real-time finance data collection.

| Deliverable | Location |
|-------------|----------|
| **University outreach letter** | [university-research-outreach-letter.md](./university-research-outreach-letter.md) |
| **University project brief** | [university-research-project-brief.md](./university-research-project-brief.md) |

---

## Quick Reference: Where to Find What

| Need | Where |
|------|--------|
| Partnership docs (Phase 1) | `docs/partnership/` |
| University research (letter + brief) | [university-research-outreach-letter.md](./university-research-outreach-letter.md), [university-research-project-brief.md](./university-research-project-brief.md) |
| Data requirements & formats | `docs/partnership/data-requirements.md` |
| Architecture & diagrams | `docs/architecture/` |
| Ingestion service | `services/ingestion/` |
| Database schema (SQL) | `docs/architecture/database-schema.sql` |
| Data flow narrative | `docs/architecture/data-flow.md` |
