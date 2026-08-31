#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Installing dependencies…"
npm install

echo "→ Adding Android platform (skip if exists)…"
if [ ! -d android ]; then
  npx cap add android
else
  echo "  android/ already present"
fi

if [[ "$(uname)" == "Darwin" ]]; then
  echo "→ Adding iOS platform (skip if exists)…"
  if [ ! -d ios ]; then
    npx cap add ios
  else
    echo "  ios/ already present"
  fi
else
  echo "  Skipping iOS (macOS + Xcode required)"
fi

echo "→ Syncing Capacitor…"
npx cap sync

echo ""
echo "Done. Next:"
echo "  npm run cap:android   # open Android Studio"
echo "  npm run cap:ios       # open Xcode (Mac only)"
