import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";
import { initializeApp } from "@/lib/init";

// Initialize the app during server startup
if (typeof window === 'undefined') {
  initializeApp();
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoVertX | Real-Time Cryptocurrency Conversion",
  description: "A sleek and powerful desktop application for real-time cryptocurrency conversion and tracking. Convert between multiple cryptocurrencies with live price updates.",
  keywords: "cryptovertx, cryptocurrency, bitcoin, ethereum, crypto tracking, desktop app",
  authors: [{ name: "CryptoVertX Team" }],
  creator: "CryptoVertX Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cryptovertx.com",
    title: "CryptoVertX | Real-Time Cryptocurrency Conversion",
    description: "A sleek and powerful desktop application for real-time cryptocurrency conversion and tracking.",
    siteName: "CryptoVertX",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 1200,
        alt: "CryptoVertX App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoVertX | Real-Time Cryptocurrency Conversion",
    description: "A sleek and powerful desktop application for real-time cryptocurrency conversion and tracking.",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
