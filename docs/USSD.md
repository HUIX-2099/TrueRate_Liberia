# USSD / Short code (feature phones)

Reach users without smartphones by offering the rate via USSD or a short code.

## Concept

- User dials a short code (e.g. **\*123#** or **\*TR#**).
- Menu: "1. Today's rate 2. Last 7 days 3. Unsubscribe"
- Response: "USD/LRD: 192.50. Buy 191 Sell 194. TrueRate Liberia."

## Requirements

- A **USSD gateway** or **short code** from a mobile operator or aggregator (e.g. Africa's Talking, Twilio in some markets, or direct with Lonestar/Orange Liberia).
- A backend that handles USSD session (request/response) and fetches the current rate (e.g. from your existing `/api/rates/live` or CBL).

## Integration options

1. **Africa's Talking** – USSD API: create a session endpoint that returns menu or result; use their USSD product to point to your URL.
2. **Operator direct** – Some MNOs offer short codes and a callback URL; you implement the same request/response contract.
3. **SMS fallback** – If USSD is not available, "Text RATE to 12345" and respond with one SMS containing the rate (same as SMS alerts backend).

## Backend sketch

- `POST /api/ussd` (or the URL your provider calls):
  - Input: `sessionId`, `phoneNumber`, `text` (user input, e.g. "" or "1").
  - If `text` is empty → return main menu.
  - If `text` is "1" → fetch live rate, return "USD/LRD: X.XX ...".
  - Response format is provider-specific (e.g. CON vs END for Africa's Talking).

Once you have a short code and provider docs, add `api/ussd/route.ts` that reads `process.env.USSD_PROVIDER` and delegates to the right handler.
