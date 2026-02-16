# Environment variables

Optional env vars used by TrueRate Liberia.

## SMS alerts (optional)

To send real SMS when users subscribe to rate alerts, configure a provider in `.env.local`:

- **SMS_PROVIDER** – `twilio` or `africas_talking`
- **SMS_API_KEY** – Provider API key (or use provider-specific names below)

### Twilio

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER` (e.g. +1234567890)

### Africa's Talking

- `AFRICAS_TALKING_API_KEY`
- `AFRICAS_TALKING_USERNAME`
- `AFRICAS_TALKING_SENDER_ID` (optional)

The subscribe API stores subscriptions regardless; when these are set, you can extend `app/api/sms/subscribe/route.ts` to send a confirmation SMS or register the number with your provider.
