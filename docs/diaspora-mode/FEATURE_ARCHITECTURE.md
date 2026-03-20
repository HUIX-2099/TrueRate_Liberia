# Diaspora Marketplace — Feature Folder Architecture

Recommended structure for the fintech-enabled Diaspora Marketplace (Next.js App Router, TypeScript).

---

## 1. App routes

```
app/
  diaspora/
    layout.tsx              # DiasporaCartProvider wrapper
    page.tsx                 # Dashboard (overview, panels)
    admin/
      page.tsx               # Admin dashboard (vendors, orders, disputes)
    marketplace/
      page.tsx                # Marketplace home: vendors + categories + products
      checkout/
        page.tsx              # Checkout: recipient form, fees, place order
      order-confirmation/
        page.tsx              # Order confirmation (orderId query)
      orders/
        page.tsx              # User order list
  api/
    diaspora/
      vendors/
        route.ts              # GET list
        [id]/
          route.ts            # GET vendor + products
      products/
        route.ts              # GET list (category, vendorId)
        [id]/
          route.ts            # GET product
      cart/
        quote/
          route.ts            # POST fee breakdown + FX
      checkout/
        route.ts              # POST create order, return confirmation URL
      orders/
        route.ts              # GET list (user)
        [id]/
          route.ts            # GET order detail
      webhooks/
        stripe/
          route.ts            # POST Stripe webhook (Phase 2)
```

---

## 2. Lib (shared logic & data)

```
lib/
  diaspora/
    types.ts                  # Vendor, Product, CartItem, Order, FeeBreakdown, etc.
    constants.ts              # Categories, fee defaults, status labels
    mock-data.ts              # Mock vendors/products (MVP)
    fees.ts                   # computeFeeBreakdown()
    order-store.ts            # In-memory order store (MVP); replace with Prisma
    cart-context.tsx          # Cart state + localStorage persistence
    index.ts                  # Public exports
```

---

## 3. UI components

```
components/
  diaspora/
    Marketplace/
      MarketplaceHero.tsx
      HowItWorks.tsx
      CategoryStrip.tsx
      ProductGrid.tsx
      ProductCard.tsx
      VendorCard.tsx            # Legacy card (trust score, delivery)
      VendorListSection.tsx     # API-driven vendor list + verified badge
      CartDrawer.tsx
      CartTrigger.tsx
      types.ts                 # Local Product/CartItem for grid/card
      index.ts
    layout/
      DashboardShell.tsx
      Sidebar.tsx
      MobileBottomNav.tsx
      LiveHeader.tsx
    ...
```

---

## 4. Database (Prisma)

```
prisma/
  schema.prisma               # users, vendors, products, orders, order_items,
                              # vendor_ratings, fraud_reports, disputes, activity_logs
```

Use `DATABASE_URL` when set; otherwise API uses mock data and in-memory order store.

---

## 5. Security & auth (Phase 2)

- **Auth**: JWT or OAuth (e.g. NextAuth) with roles: `user`, `vendor`, `admin`.
- **Routes**: Browse marketplace public; cart/checkout/orders require auth (or guest checkout with session).
- **Admin**: `/diaspora/admin` and admin API routes gated by `role === 'admin'`.
- **Payments**: Stripe Checkout + webhook; no card data on your server (PCI-compliant).
- **Input**: Validate all API body/query with Zod (or similar).
- **Rate limiting**: Apply to checkout and auth endpoints.

---

## 6. Data flow summary

| Flow              | Client                         | API                         | Data source (Phase 2)   |
|-------------------|--------------------------------|-----------------------------|-------------------------|
| List vendors      | GET /api/diaspora/vendors      | getMockVendors / Prisma     | DB                      |
| List products     | GET /api/diaspora/products     | getMockProducts / Prisma    | DB                      |
| Cart quote        | POST /api/diaspora/cart/quote  | computeFeeBreakdown + FX    | rates API + fees        |
| Checkout          | POST /api/diaspora/checkout    | createOrder + redirect URL  | order-store / Prisma    |
| Order list/detail | GET /api/diaspora/orders       | listOrders / getOrderById   | order-store / Prisma    |
