# Legal Compliance Checklist — Ministry Data Partnership  
## TrueRate Liberia

**Document type:** Compliance documentation  
**Version:** 1.0  
**Use:** Pre-launch and periodic compliance verification

---

## 1. Pre-Partnership (Before Data Flows)

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 1.1 | Formal partnership proposal submitted to MoCI | ☐ | See `partnership-proposal.md` |
| 1.2 | Data access request letter submitted | ☐ | See `data-access-request-letter.md` |
| 1.3 | Memorandum of Understanding (MoU) signed | ☐ | |
| 1.4 | Data Sharing Agreement (DSA) signed | ☐ | See `data-sharing-agreement.md` |
| 1.5 | Data governance policy adopted internally | ☐ | See `data-governance-policy.md` |
| 1.6 | Designated compliance/contact owner assigned | ☐ | |
| 1.7 | Legal review of MoU and DSA completed | ☐ | |

---

## 2. Data Usage Purpose (Aligned with DSA)

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 2.1 | Data used only for: fintech analytics, verification, market transparency | ☐ | |
| 2.2 | No sale or sublicense of ministry data to third parties | ☐ | |
| 2.3 | Attribution to Ministry displayed where data is shown | ☐ | |
| 2.4 | Aggregated/anonymized use only for complaint-related data (no personal data) | ☐ | |

---

## 3. Technical and Security

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 3.1 | Ministry credentials in secrets (env/vault); not in code or repo | ☐ | |
| 3.2 | Ingestion is single entry point; no direct public DB access | ☐ | See `docs/architecture/data-flow.md` |
| 3.3 | Audit logging for ingestion and access to ministry data | ☐ | e.g. `ingestion_logs` |
| 3.4 | Database access restricted to authorized services/roles | ☐ | |
| 3.5 | Retention and deletion procedures match DSA Annex | ☐ | |

---

## 4. Operational

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 4.1 | Format and frequency of data receipt match DSA | ☐ | |
| 4.2 | Incident response process includes notifying MoCI if required | ☐ | |
| 4.3 | Compliance/usage reports to MoCI as per MoU/DSA schedule | ☐ | |

---

## 5. Periodic Review (e.g. Annual)

| # | Action | Last done | Next due |
|---|--------|-----------|----------|
| 5.1 | Review this checklist and data governance policy | | |
| 5.2 | Verify retention and deletion against DSA | | |
| 5.3 | Confirm access rights and audit logs | | |
| 5.4 | Update MoCI on material changes (e.g. new use case) | | |

---

## 6. Ministry Partnership Confirmation

| # | Document / Evidence | Location / Reference |
|---|---------------------|----------------------|
| 6.1 | Signed MoU | [File or reference] |
| 6.2 | Signed DSA | [File or reference] |
| 6.3 | Designated MoCI contact and escalation path | [Contact list] |
| 6.4 | Confirmation of data delivery method and format | [Email or annex] |

---

*Use this checklist at go-live and at least annually. Sign off and date when each section is verified.*
