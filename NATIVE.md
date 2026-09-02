# Tiltshield native (Capacitor)

Web app on Vercel is the source of truth. Android / iOS shells load that URL so auth, Flutterwave, and APIs work.

## Prerequisites

- Node 18+
- **Android:** Android Studio + SDK
- **iOS:** macOS + Xcode (Apple Developer account for TestFlight / App Store)

## One-time setup

```bash
npm install
npx cap add android   # creates android/
npx cap add ios       # macOS only — creates ios/
```

## Point at production (default)

`capacitor.config.ts` uses:

```
https://tiltshield.vercel.app
```

Change to your real Vercel domain if different:

```bash
CAP_SERVER_URL=https://YOUR-APP.vercel.app npx cap sync
```

## Sync & open IDE

```bash
npm run cap:sync
npm run cap:android   # opens Android Studio
npm run cap:ios       # opens Xcode (macOS)
```

## Local device against `next dev`

1. Run Next on your LAN IP:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```
2. Sync:
   ```bash
   CAP_SERVER_URL=http://192.168.x.x:3000 npx cap sync
   ```
3. Rebuild in Android Studio / Xcode.

## Store checklist

| Step | Notes |
|------|--------|
| App ID | `app.tiltshield.mobile` |
| Icons / splash | `resources/` + IDE assets |
| Privacy policy URL | Required for Play / App Store |
| Payments | Flutterwave in WebView — confirm store rules for digital goods |
| Signing | Play upload key / Apple certs |

## Scripts

- `npm run cap:sync`
- `npm run cap:android` / `npm run cap:ios`
- `npm run cap:add:android` / `npm run cap:add:ios`

Native **signed** builds must run on your machine (or CI with macOS/Android runners).
