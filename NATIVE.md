# Tiltshield native (Capacitor) — production

## Env (Vercel)

| Variable | Purpose |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Auth + cloud |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client |
| `FLUTTERWAVE_SECRET_KEY` | Real payments |
| `NEXT_PUBLIC_APP_URL` | Redirects + Capacitor URL |
| `FLUTTERWAVE_AMOUNT` | Default 29 |
| `FLUTTERWAVE_FAMILY_AMOUNT` | Default 12 |
| `FLUTTERWAVE_CURRENCY` | USD |

## Setup on your machine

```bash
export NEXT_PUBLIC_APP_URL=https://YOUR_PRODUCTION_URL
npm install
npx cap add android
npx cap add ios   # macOS
npx cap sync
npm run cap:android
```

No demo unlocks — unlock only after Flutterwave verify on `/results`.
