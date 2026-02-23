# TrueRate Fintech Architecture

Scalable fintech architecture for TrueRate Liberia integrating **Ministry of Commerce Liberia** market data with a microservice backend, PostgreSQL, Redis, and Next.js frontend.

## Contents

| Document | Description |
|----------|-------------|
| [System Architecture](./system-architecture.md) | High-level architecture, components, deployment |
| [Data Flow](./data-flow.md) | Ingestion → services → cache → frontend |
| [Service Structure](./services.md) | Microservice layout, APIs, and contracts |
| [Database Schema](./database-schema.sql) | PostgreSQL schema and Redis key design |
| [Market Intelligence Schema](./market-intelligence-schema.sql) | Market intelligence tables: commodity_prices, import_statistics, trade_reports, market_indicators, data_source_logs |
| [Data Pipeline Design](./data-pipeline-design.md) | Ministry data ingestion pipeline, formats, security |
| [Data Schema Overview](./data-schema-overview.md) | Logical schema overview and Redis key reference |
| [System Architecture Diagram](./system-architecture-diagram.md) | Mermaid diagrams: end-to-end and data integration |

**Partnership & compliance (Phase 1–2):** See [../partnership/](../partnership/) for proposal, DSA outline, data governance, and [MINISTRY_PARTNERSHIP_ROADMAP.md](../partnership/MINISTRY_PARTNERSHIP_ROADMAP.md) for the full phased roadmap.

## Quick Reference

- **External data:** Ministry of Commerce Liberia (commodity prices, trade/import data)
- **Backend:** Node.js microservices (data ingestion, commodity analytics, trade analytics, market risk)
- **Data store:** PostgreSQL (persistent), Redis (cache/sessions)
- **Frontend:** Next.js (existing app); API gateway/BFF in front of services
