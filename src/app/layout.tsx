import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PWARegister } from "@/components/PWARegister";
import MotionProvider from "@/components/MotionProvider";
import WorldCupProvider from "@/components/worldcup/WorldCupProvider";
import WorldCupOverlay from "@/components/worldcup/WorldCupOverlay";

export const metadata: Metadata = {
  title: "Insta 1011 × FIFA World Cup 2026 — Instagram Profile Analyzer",
  description: "Real Instagram profile analysis – FIFA World Cup 2026 Argentina Edition 🇦🇷⚽ Built by @ARVINDJAAT1011",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Insta 1011 WC26",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-512.png",
  },
  openGraph: {
    title: "Insta 1011 × FIFA World Cup 2026",
    description: "Real Instagram Profile Intelligence – Argentina Edition 🇦🇷⚽",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insta 1011 × FIFA World Cup 2026",
    description: "Real Instagram Profile Intelligence – Vamos Argentina 🇦🇷",
  },
};

export const viewport: Viewport = {
  themeColor: "#74acdf",
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
        <meta name="apple-mobile-web-app-title" content="Insta 1011 WC26" />
        <link rel="apple-touch-icon" href="/icon-512.png" />
      </head>
      <body className="text-white antialiased min-h-screen" style={{ background: "#030305" }}>
        <WorldCupProvider>
          <MotionProvider>
            {children}
            <WorldCupOverlay />
          </MotionProvider>
        </WorldCupProvider>
        <PWARegister />
      </body>
    </html>
  );
}
