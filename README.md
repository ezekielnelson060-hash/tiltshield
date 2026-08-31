# Tiltshield

**Know what could break. Fix it before it does.**

Personal Independence OS — assessment, vulnerabilities, daily actions, What If? simulator.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Payments (global, USD)

Flutterwave one-time **$29 USD** founding unlock.

```
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...
FLUTTERWAVE_AMOUNT=29
FLUTTERWAVE_CURRENCY=USD
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Deploy

Import this repo on Vercel. Add the env vars above. Redeploy after every push to main.
