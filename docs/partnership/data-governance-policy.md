# TrueRate Liberia — Data Governance Policy  
## Ministry and Official Data

**Document type:** Internal governance policy  
**Version:** 1.0  
**Scope:** All data received from the Ministry of Commerce and Industry (MoCI) or other government partners  
**Owner:** [Designated role, e.g. Data Protection / Compliance]

---

## 1. Purpose

This policy defines how TrueRate collects, stores, uses, and protects **official data** received under partnership agreements (e.g. MoU and Data Sharing Agreement with MoCI). It ensures:

- **Lawful and agreed use** of ministry data.  
- **Security and confidentiality** appropriate to government data.  
- **Accountability** through clear roles and audit.  
- **Consistency** with our legal and contractual obligations.

---

## 2. Scope

- **In scope:** All datasets received from MoCI or other government bodies under a formal data-sharing or partnership agreement.  
- **Out of scope:** Data we collect from other sources (e.g. exchange rates from CBL or other APIs, user submissions) — those are governed by our general privacy and data policies.

---

## 3. Principles

| Principle | Description |
|-----------|-------------|
| **Purpose limitation** | Ministry data is used only for the purposes defined in the MoU and Data Sharing Agreement. |
| **Minimal necessary use** | We request and use only the data necessary for those purposes. |
| **No resale** | We do not sell or sublicense ministry data to third parties. |
| **Attribution** | We clearly attribute official data to the Ministry (or as agreed). |
| **Security by default** | Access control, encryption where appropriate, and audit logging. |
| **Retention limits** | We retain data only for the period agreed and then delete or return it. |

---

## 4. Roles and Responsibilities

| Role | Responsibility |
|------|----------------|
| **Partnership / Legal** | Negotiate and maintain MoU and DSA; ensure internal compliance. |
| **Engineering / Data** | Implement secure ingestion, storage, and access; maintain audit logs. |
| **Product** | Use data only for agreed features; ensure attribution in UI. |
| **Compliance** | Periodic review of access, retention, and compliance with this policy and the DSA. |

---

## 5. Data Lifecycle

### 5.1 Receipt

- Data is received only through agreed channels (API, secure transfer, or designated contact).  
- Credentials and access details are stored in secrets management (e.g. environment variables or vault); never in code or public repos.  
- Incoming payloads are validated (schema/format) before persistence; failures are logged.

### 5.2 Storage

- **Database:** PostgreSQL with access restricted to ingestion and authorized services; encrypted at rest and in transit where supported.  
- **Raw ingest:** Original payloads are retained in `moc_raw_ingest` (or equivalent) for audit and idempotency; access is restricted.  
- **Normalized data:** Stored in designated tables (e.g. `commodity_prices`, `trade_declarations`); used only for Permitted Purpose.

### 5.3 Access and Use

- **Internal access:** Only authorized personnel and systems (ingestion, analytics, API layers) may read ministry data.  
- **Public display:** Only aggregated or explicitly approved data is shown; with clear Ministry attribution.  
- **APIs:** Any external API that exposes ministry-derived data must be rate-limited and documented; use must align with Permitted Purpose.

### 5.4 Retention and Deletion

- Retention periods follow the Data Sharing Agreement (and Annex).  
- After the retention period or upon termination, data is deleted or returned as specified; deletion is logged and can be certified to the Ministry if requested.

---

## 6. Security Measures

- **Authentication:** API keys or credentials for ministry endpoints stored in secrets; rotated as per policy or on compromise.  
- **Network:** Ministry data flows only through the designated ingestion layer; no direct internet exposure of the database.  
- **Audit logging:** Ingestion runs, access to raw and normalized ministry data, and failures are logged (e.g. `ingestion_logs`, application logs).  
- **Incident response:** Suspected breach or misuse of ministry data is escalated immediately; MoCI is notified as required by the DSA.

---

## 7. Compliance and Review

- **Compliance checklist:** Maintained to document adherence to DSA and this policy (see `legal-compliance-checklist.md`).  
- **Review:** This policy and related procedures are reviewed at least annually or when the DSA/MoU changes.  
- **Reporting:** Summary compliance or usage reports are provided to MoCI as agreed in the MoU/DSA.

---

## 8. Related Documents

- Memorandum of Understanding (MoU)  
- Data Sharing Agreement (DSA)  
- Legal compliance checklist  
- Architecture: `docs/architecture/data-flow.md`, `docs/architecture/system-architecture.md`  
- Ingestion: `services/ingestion/README.md`
