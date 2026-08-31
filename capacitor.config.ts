import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Tiltshield native shells (Capacitor)
 *
 * Production: WebView loads the live Vercel app (API, auth, SSR all work).
 * Local: set CAP_SERVER_URL=http://YOUR_LAN_IP:3000 for device testing against `next dev`.
 */
const serverUrl =
  process.env.CAP_SERVER_URL || "https://tiltshield.vercel.app";

const config: CapacitorConfig = {
  appId: "app.tiltshield.mobile",
  appName: "Tiltshield",
  webDir: "www",
  server: {
    url: serverUrl,
    cleartext: serverUrl.startsWith("http://"),
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#09090b",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#09090b",
    },
    Keyboard: {
      resize: "body",
    },
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
  },
};

export default config;
