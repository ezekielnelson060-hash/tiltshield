# Tiltshield — setup (Supabase SQL + APIs)

## 1. Supabase SQL (run once)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **SQL Editor** → New query
3. Paste the full contents of `supabase/FULL_MIGRATION.sql` from the repo
4. **Run**

That creates: `profiles`, `assessments`, `category_scores`, `vulnerabilities`, `user_actions`, `family_members` + RLS policies.

If you already ran older SQL, this file is safe to re-run (`if not exists` / `drop policy if exists`).

**Auth:** Authentication → Providers → enable **Email** (and Google later if you want).

---

## 2. Environment variables (Vercel)

Project → **Settings → Environment Variables** → set for Production:

| Variable | Where to get it | Required |
|----------|-----------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` `public` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → `service_role` (secret) | Yes (webhooks/admin) |
| `NEXT_PUBLIC_APP_URL` | Live URL e.g. `https://tiltshield.vercel.app` | Yes |
| `FLUTTERWAVE_SECRET_KEY` | Flutterwave → Settings → API keys | Yes for pay |
| `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` | Flutterwave public key | Yes for pay |
| `FLUTTERWAVE_SECRET_HASH` | Flutterwave → Webhooks secret hash | Recommended |
| `FLUTTERWAVE_AMOUNT` | e.g. `29` | Optional |
| `FLUTTERWAVE_CURRENCY` | `USD` | Optional |

Redeploy after saving env vars.

---

## 3. Flutterwave

1. [Flutterwave dashboard](https://dashboard.flutterwave.com) → API keys (test, then live)
2. **Webhooks** URL: `https://YOUR_DOMAIN/api/flutterwave/webhook`
3. Copy the **secret hash** into `FLUTTERWAVE_SECRET_HASH`
4. Use **USD** and live keys for production

Checkout starts from the app via `POST /api/flutterwave/initialize`.

---

## 4. Maps / places (no paid key required today)

| Feature | Provider | Key needed? |
|---------|----------|-------------|
| Nearby search | OpenStreetMap Nominatim | No (rate-limited) |
| Map tiles | OSM + Esri World Imagery | No |
| Google Maps links | Deep links only | No |

**Optional later (denser results):** Google Places or Mapbox keys wired in `src/lib/nearby.ts`.

---

## 5. Live Intel

Google News RSS via `/api/intel/live` — **no API key**.
Alerts via `/api/alerts` — **no API key**.

---

## 6. Local dev

```bash
cp .env.example .env.local
# fill Supabase + Flutterwave
npm install
npm run dev
```

---

## 7. Checklist

- [ ] Run `supabase/FULL_MIGRATION.sql` in Supabase
- [ ] Env vars on Vercel
- [ ] Flutterwave webhook URL + hash
- [ ] Sign up on live site + complete assessment
- [ ] Test payment in Flutterwave **test** mode first

**Note:** Trusted places (Your network) are **local-only** — no SQL required.
