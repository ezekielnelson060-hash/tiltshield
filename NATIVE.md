# Tiltshield native shells (Capacitor)

Next.js on Vercel = product brain.  
Capacitor = Android / iOS shells for demos and stores.

## Quick start (your machine)

```bash
git pull
chmod +x scripts/setup-native.sh
./scripts/setup-native.sh
npm run cap:android    # or cap:ios on Mac
```

## Prerequisites

| Platform | Need |
|----------|------|
| Android | Android Studio + device/emulator |
| iOS | Mac + Xcode 15+ |

## What the app loads

Default WebView URL: `https://tiltshield.vercel.app`

Local device against your laptop:

```bash
CAP_SERVER_URL=http://192.168.x.x:3000 npx cap sync
npx next dev -H 0.0.0.0
```

## App identity

| Key | Value |
|-----|--------|
| appId | `app.tiltshield.mobile` |
| Name | Tiltshield |
| Theme | `#09090b` |

## Icons and splash

- PWA: `public/icon-192.png`, `public/icon-512.png`
- Capacitor source: `resources/icon.png`, `resources/splash.png` (copy from public icons after clone)

```bash
mkdir -p resources
cp public/icon-512.png resources/icon.png
cp public/icon-512.png resources/splash.png
```

## Investor demo checklist

1. Latest deploy is Ready on Vercel  
2. `./scripts/setup-native.sh` completed  
3. Run on a physical phone  
4. Flow: Sign up → Assessment → Overview → What If → Actions → Vault  
5. Pitch line: *Native shell + production web core — ship weekly without store delays*

## Scripts

| Command | Action |
|---------|--------|
| `./scripts/setup-native.sh` | install + add platforms + sync |
| `npm run cap:sync` | re-sync after config changes |
| `npm run cap:android` | open Android Studio |
| `npm run cap:ios` | open Xcode |
