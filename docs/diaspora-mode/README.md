# Diaspora Mode — Documentation Index

Premium feature: centralized digital command center for Liberians living abroad.

## Contents

| Document | Description |
|----------|-------------|
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | PostgreSQL schema: users, vendors, products, orders, ratings, disputes, activity logs |
| [API_ENDPOINTS.md](./API_ENDPOINTS.md) | REST API for marketplace, intelligence, investment, remittance, trust |
| [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) | MVP → Phase 2 → Phase 3 → Phase 4 rollout |
| [REVENUE_MODEL.md](./REVENUE_MODEL.md) | Revenue strategy: marketplace fees, remittance affiliate, investment listing, subscription |

## Page & Components

- **Route:** `/diaspora` — main Diaspora Mode page (hero + 5 feature modules).
- **Route:** `/diaspora/marketplace` — marketplace placeholder (categories; full cart/checkout in Phase 2).
- **Components:** `components/diaspora/` — `DiasporaHero`, `DiasporaMarketplacePreview`, `DiasporaIntelligencePreview`, `DiasporaInvestmentPreview`, `DiasporaRemittancePreview`, `DiasporaTrustPreview`.

## Tech Stack

- Next.js (App Router), TypeScript, TailwindCSS
- Stripe (Phase 2), PostgreSQL, JWT or OAuth, role-based access (User / Vendor / Admin)
