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

## App Store / Play — submission order

1. **Privacy policy + Terms** URLs on your domain (required).
2. **Screenshots** — phone frames of Today, What If, Finder, Offline value.
3. **Android**
   - `npx cap add android` → Android Studio
   - Set `applicationId` = `app.tiltshield.mobile`
   - Generate upload keystore; enable Play App Signing
   - Build signed **AAB** → Play Console internal testing first
4. **iOS** (Mac)
   - `npx cap add ios` → Xcode
   - Bundle ID `app.tiltshield.mobile`
   - Archive → TestFlight → App Store review
5. **Payments note** — Flutterwave runs in the WebView. Confirm current store rules for digital goods in your region.
6. **Push (optional later)** — Capacitor Push Notifications after Apple/Firebase credentials.

## PWA install (web, no store)

Users can **Add to Home Screen** from the browser. Service worker targets `/app/*` offline shells.
