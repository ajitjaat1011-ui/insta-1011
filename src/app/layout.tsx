import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PWARegister } from "@/components/PWARegister";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Insta 1011 — Instagram Profile Analyzer",
  description: "Real Instagram profile analysis with AI-powered insights. Built by @ARVINDJAAT1011",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Insta 1011",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-512.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#a855f7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Insta 1011" />
        <link rel="apple-touch-icon" href="/icon-512.png" />
      </head>
      <body className="text-white antialiased min-h-screen" style={{ background: "#030305" }}>
        {children}
        <PWARegister />
        <SpeedInsights />
      </body>
    </html>
  );
}
