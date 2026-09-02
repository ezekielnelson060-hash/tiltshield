# Tiltshield native (Capacitor)

Web app is the source of truth (Vercel). Native shells load the production URL.

## One-time

```bash
npm install
npx cap add android   # requires Android Studio
npx cap add ios       # macOS + Xcode only
```

## Sync & open

```bash
npm run cap:sync
npm run cap:android   # or cap:ios
```

## Local device against next dev

```bash
CAP_SERVER_URL=http://YOUR_LAN_IP:3000 npx cap sync
```

App ID: `app.tiltshield.mobile`
