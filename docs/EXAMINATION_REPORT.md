# TrueRate Liberia — Project Examination Report

This document summarizes errors, risks, and improvement opportunities for the TrueRate Liberia platform (Next.js 16, React 19).

---

## 1. Build & TypeScript

### Issues

- **TypeScript build errors are ignored**  
  `next.config.mjs` has `typescript: { ignoreBuildErrors: true }`. This allows the app to build even when there are type errors, which can hide bugs and make refactors riskier.

- **Recommendation:** Remove `ignoreBuildErrors` and fix any reported TypeScript errors so the type system is enforced in CI and locally.

### Build behavior

- Production build completes successfully.
- During static generation, external fetches (CBL, Xe, news feeds, etc.) can fail with `ENOTFOUND` when run in environments without network (e.g. CI). The app handles these failures and uses fallbacks, so this is expected rather than a code bug.

---

## 2. Security & Error Handling

### Addressed in this pass

- **API error detail leakage**  
  `/api/price-check` previously returned `detail: error.message` in 500 responses. This was removed so internal error messages are not exposed to clients.

- **Error UI in production**  
  `app/error.tsx` was showing `error.message` to all users. It now shows the raw message only when `NODE_ENV === "development"`.

### Remaining considerations

- **Community rate reports (`/api/community/rate-reports`)**  
  - POST has no authentication; anyone can submit reports. Consider rate limiting and/or auth for production.
  - `photoUrl` accepts any `http` URL; validate or restrict to trusted domains to reduce SSRF/abuse risk.
  - Data is stored in memory; reports are lost on restart. Moving to a database is required for persistence and scale.

- **CORS on `/api/rates/live`**  
  `Access-Control-Allow-Origin: "*"` is used for the embeddable widget. Acceptable for a public read-only API; ensure no sensitive or user-specific data is returned.

- **Secrets and env**  
  API keys fall back to `"demo"` when unset (e.g. Maps, Exchange Rate API). Ensure production env has real keys and that “demo” behavior is safe (e.g. no accidental writes or privileged operations).

---

## 3. Dependency Hygiene

- Several packages use **`"latest"`** (e.g. Radix UI components, `expo`, `react-native`, `recharts`, `three`). This can lead to non-reproducible installs and unexpected breaking changes.
- **Recommendation:** Pin to exact or caret ranges (e.g. `^x.y.z`) and upgrade in a controlled way with tests.

---

## 4. Testing

- **Integration tests** in `tests/integration/moc-api.test.mjs` cover health, MoC, monitoring, trade analytics, cost-of-living, sync logs, scheduler, and regulatory APIs. They assume the app is running (e.g. `BASE_URL=http://localhost:3000`).
- **Gaps:**  
  - No unit tests for libs (e.g. `multi-source-rates`, verification, CBL fetchers).  
  - No E2E tests for critical user flows (converter, diaspora, marketplace).  
  - `pnpm test:integration` does not start the server; document or script “start server then run tests” for CI.

---

## 5. UX & Resilience

- **Error boundaries**  
  `app/error.tsx` (route-level) and `app/global-error.tsx` (root) are implemented and give users a clear “Something went wrong” and retry/home actions.

- **Loading states**  
  Root and some routes (e.g. `liberia-market`) have `loading.tsx`. Consider adding route-level loading for other heavy pages (converter, analytics, diaspora, predictions) to improve perceived performance.

- **404**  
  No custom `app/not-found.tsx`. Adding one (with branding and navigation) would improve UX when users hit invalid URLs.

---

## 6. Data & External Services

- **Rate aggregation**  
  `lib/api/multi-source-rates.ts` aggregates multiple sources (CBL, Xe, Exchange Rate API, etc.) with fallbacks and a hardcoded fallback rate (e.g. 185.72) when all fail. Behavior is robust; consider logging when fallback is used so you can monitor source health.

- **CBL scraping**  
  CBL data is fetched from research tables and homepage. If the CBL site structure changes, parsers may break. Consider tests or alerts that detect unexpected response shapes or missing fields.

- **Verification**  
  `lib/verification` uses a static allowlist of changer IDs that matches the mock changers in `/api/rates/live`. When moving to real ministry/DB data, replace this with a proper lookup and keep the same interface.

---

## 7. Platform Improvement Ideas

1. **Reproducible builds**  
   Pin dependencies (no `"latest"`), enforce `pnpm-lock.yaml` in CI, and optionally use a lockfile-only install.

2. **Type safety**  
   Remove `ignoreBuildErrors`, fix TypeScript errors, and run `tsc` or `next build` in CI so type regressions are caught.

3. **Observability**  
   Add structured logging (e.g. request IDs, route, status) and optional APM for API routes and critical client flows.

4. **Rate limiting**  
   Apply rate limits to public write endpoints (e.g. rate reports, contact, digest signup) and optionally to heavy read endpoints (e.g. rates, price-index) to protect availability.

5. **Docs and runbooks**  
   Document env vars (required vs optional, which keys are needed for which features), and add a short runbook for “rates not updating” (check CBL, Xe, and fallback usage).

6. **Accessibility**  
   You already use semantic HTML and skip links. Consider an audit (e.g. axe) on key pages (home, converter, diaspora) and fix any focus/aria/label issues.

7. **PWA and offline**  
   You have a service worker and manifest. Verify offline behavior and cache invalidation so users get fresh rates when back online.

---

## 8. Summary of Changes Made

### Initial pass

| File | Change |
|------|--------|
| `app/api/price-check/route.ts` | Removed `detail: error.message` from 500 responses to avoid leaking internal errors. |
| `app/error.tsx` | Show raw `error.message` only when `NODE_ENV === "development"`. |

### Follow-up (continued improvements)

| File / area | Change |
|------------|--------|
| `app/not-found.tsx` | Added custom 404 page with branding, Home and Go back actions. |
| `app/converter/loading.tsx` | Route-level loading skeleton for converter. |
| `app/diaspora/loading.tsx` | Route-level loading skeleton for diaspora. |
| `app/predictions/loading.tsx` | Route-level loading skeleton for predictions. |
| `package.json` | Pinned all `"latest"` dependencies to concrete `^x.y.z` versions (Radix, expo, recharts, three, next-themes, etc.) for reproducible installs. |
| `docs/ENV.md` | Added environment variable reference and “rates not updating” note. |
| `next.config.mjs` | Documented `ignoreBuildErrors` with an inline comment. |

---

*Report generated from codebase examination. Re-run build and tests after any dependency or config changes.*
