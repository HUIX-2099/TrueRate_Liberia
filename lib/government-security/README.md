# Government Data Integration Security

Security layer for government data APIs: API authentication, encryption, role-based access, audit logs, and rate limiting.

## API Authentication

- **Methods:** `Authorization: Bearer <key>`, `X-API-Key: <key>`, or query `?api_key=<key>`
- **Keys:** Configure via env or `registerGovernmentKey()`.
  - **Single key:** `GOV_API_KEY`, optional `GOV_API_KEY_NAME`, `GOV_API_KEY_ROLES` (comma-separated: `gov_viewer,gov_analyst`)
  - **Multiple keys:** `GOV_API_KEYS` = JSON array of `{ "key": "...", "name": "...", "roles": ["gov_viewer"] }`
- Unauthenticated requests receive `401 Unauthorized`.

## Roles

| Role          | Description                    |
|---------------|--------------------------------|
| `gov_viewer`  | Read-only access to government data |
| `gov_analyst` | Viewer + sensitive read         |
| `gov_admin`   | Full access, can manage keys    |
| `gov_auditor` | Read audit logs only           |

Use `withGovernmentSecurity(handler, { roles: ["gov_admin"] })` to restrict by role.

## Encryption

- **Transport:** Use HTTPS (TLS) for all API traffic.
- **Field-level:** Set `GOV_ENCRYPTION_KEY` (32-byte hex or base64). Use `encryptField()` / `decryptField()` or `encryptSensitiveFields()` / `decryptSensitiveFields()` for sensitive payloads before storing or sending.

## Audit Logs

- Every government API access is logged: action `api.access`, actor, resource (path), result (`success` | `denied` | `error`), timestamp, IP, user-agent.
- Retrieve logs via `GET /api/government/audit-logs` (requires `gov_auditor` or `gov_admin`). Query: `since`, `actor`, `action`, `result`, `limit`.

## Rate Limiting

- Default: 100 requests per 60 seconds per API key (or per IP if unauthenticated).
- Responses include `X-RateLimit-Remaining` and `X-RateLimit-Reset`.
- `429 Too Many Requests` when exceeded. Override in `withGovernmentSecurity(handler, { rateLimit: { maxRequests, windowSeconds } })`.

## Protected Routes

- `GET /api/government/data` — Aggregated rate (and optional) data; any authenticated role.
- `GET /api/government/audit-logs` — Audit events; `gov_auditor` or `gov_admin` only.
- `GET /api/government/health` — Health and security capabilities; any authenticated role.
