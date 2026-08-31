# Tiltshield native shells (Capacitor)

The product UI stays Next.js on Vercel. Capacitor wraps it in **Android** and **iOS** WebView apps so you can demo and distribute as a native binary.

## Prerequisites

- Node 18+
- **Android:** Android Studio (SDK 33+)
- **iOS:** Mac + Xcode 15+ (required to build / archive)

## One-time setup (on your machine)

```bash
git pull
npm install
npx cap add android
npx cap add ios   # Mac only
npx cap sync
```

## Open in IDE

```bash
npm run cap:android   # Android Studio
npm run cap:ios       # Xcode (Mac)
```

Then press Run on a physical phone or emulator.

## What the shell loads

By default the WebView opens:

`https://tiltshield.vercel.app`

Override for local device testing:

```bash
# Machine and phone on same Wi-Fi; use your LAN IP
CAP_SERVER_URL=http://192.168.1.20:3000 npx cap sync
```

Then run `npx next dev -H 0.0.0.0` so the phone can reach your machine.

## Demo flow for investors

1. Deploy latest web app to Vercel.
2. `npx cap sync`
3. Run on a physical phone from Android Studio / Xcode.
4. App opens full-screen with dark splash — same product as production.

## App IDs

| Platform | ID |
|----------|-----|
| Bundle / applicationId | `app.tiltshield.mobile` |
| Display name | Tiltshield |

Change in `capacitor.config.ts` + native project settings before store submission.

## Store notes

- Apple requires a Mac to archive and upload.
- Privacy policy URL required.
- Sign in with Apple if you add other social logins later.

## Scripts

| Script | Purpose |
|--------|--------|
| `npm run cap:sync` | Copy config + plugins into native projects |
| `npm run cap:android` | Open Android Studio |
| `npm run cap:ios` | Open Xcode |
