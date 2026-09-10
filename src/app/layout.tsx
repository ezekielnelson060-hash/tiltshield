import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NativeInit } from "@/components/native-init";
import { InstallPrompt } from "@/components/install-prompt";
import { AnalyticsScripts } from "@/components/analytics-scripts";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const SITE_URL = "https://www.tiltshield.xyz";
const SITE_TITLE = "TiltShield — Know What Could Break Before It Does";
const SITE_DESCRIPTION =
  "Measure your financial, digital, food, and payment exposure. See your break points — then fix them before the world tests them.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "TiltShield",
  authors: [{ name: "TiltShield" }],
  keywords: [
    "exposure intelligence",
    "break point",
    "emergency fund",
    "resilience",
    "financial preparedness",
    "personal risk",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TiltShield",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "TiltShield",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "TiltShield — personal exposure intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/icon-512.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased`}
      >
        <AnalyticsScripts />
        <NativeInit />
        <InstallPrompt />
        {children}
      </body>
    </html>
  );
}
