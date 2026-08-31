import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NativeInit } from "@/components/native-init";
import { InstallPrompt } from "@/components/install-prompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Tiltshield — Prepare for what might come next",
  description:
    "Income-based readiness. What If planning, home kits, local vendors, and daily actions when systems change.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tiltshield",
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
        <NativeInit />
        <InstallPrompt />
        {children}
      </body>
    </html>
  );
}
