# TrueRate — System Architecture Diagram  
## End-to-End View (Ministry → User)

**Document type:** Architecture diagram  
**Version:** 1.0  
**Related:** [system-architecture.md](./system-architecture.md), [data-flow.md](./data-flow.md), [data-pipeline-design.md](./data-pipeline-design.md)

---

## 1. High-Level System Architecture (Mermaid)

```mermaid
flowchart TB
  subgraph External["External"]
    MoCI["Ministry of Commerce & Industry\n(Commodity, Trade, Licensing)"]
    CBL["Central Bank / FX Sources"]
  end

  subgraph Ingestion["Secure Data Ingestion Layer"]
    Auth["Auth / API Key"]
    RateLimit["Rate Limit"]
    Validate["Validate & Idempotency"]
    Normalize["Normalize"]
    Auth --> RateLimit --> Validate --> Normalize
  end

  subgraph Data["Data Layer"]
    PG[("PostgreSQL\n(commodities, ports,\ncommodity_prices,\ntrade_declarations,\nraw_ingest, logs)")]
    Redis[("Redis\n(cache, rate limit,\nsessions)")]
  end

  subgraph Services["Microservices / Logic"]
    Commodity["Commodity Price\nAnalytics"]
    Trade["Trade/Import\nAnalytics"]
    Risk["Market Risk Engine"]
  end

  subgraph API["API Layer"]
    BFF["Next.js API Routes\n(BFF / Gateway)"]
  end

  subgraph Frontend["Frontend"]
    Next["Next.js App\n(Rates, Converter,\nMarket Intelligence,\nLiberia Market)"]
  end

  MoCI -->|"API / CSV / Reports"| Auth
  CBL -.->|"Rates (existing)"| BFF
  Normalize --> PG
  PG --> Commodity
  PG --> Trade
  PG --> Risk
  Commodity --> Redis
  Trade --> Redis
  Risk --> Redis
  Commodity --> BFF
  Trade --> BFF
  Risk --> BFF
  Redis --> BFF
  BFF --> Next
```

---

## 2. Data Integration Blueprint (Phase 2 Outcome)

```mermaid
flowchart LR
  subgraph Sources["Priority Data Sources"]
    S1["1. Business registration"]
    S2["2. Commodity prices"]
    S3["3. Trade/import stats"]
    S4["4. Licensing status"]
    S5["5. Aggregated complaints"]
  end

  subgraph Formats["Formats Accepted"]
    F1["API (JSON)"]
    F2["CSV / Excel"]
    F3["Scheduled reports"]
  end

  subgraph Pipeline["TrueRate Pipeline"]
    Ingest["Ingestion Service"]
    DB[("PostgreSQL")]
    Ingest --> DB
  end

  S1 --> F1
  S2 --> F1
  S3 --> F1
  S4 --> F1
  S5 --> F2
  F1 --> Ingest
  F2 --> Ingest
  F3 --> Ingest
```

---

## 3. Deployment (Logical)

| Component | Deployment |
|-----------|------------|
| Ingestion | Node.js process (cron daemon or serverless); `services/ingestion`. |
| PostgreSQL | Managed (e.g. RDS, Supabase, Neon); schema from `database-schema.sql`. |
| Redis | Managed (e.g. ElastiCache, Upstash). |
| Next.js (BFF + Frontend) | Current host (e.g. Vercel); API routes under `app/api/`. |

---

*For narrative and security summary, see [system-architecture.md](./system-architecture.md).*
