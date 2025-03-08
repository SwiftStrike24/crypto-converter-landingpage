import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Converter | Real-Time Cryptocurrency Conversion",
  description: "A sleek and powerful desktop application for real-time cryptocurrency conversion and tracking. Convert between multiple cryptocurrencies with live price updates.",
  keywords: "crypto converter, cryptocurrency, bitcoin, ethereum, crypto tracking, desktop app",
  authors: [{ name: "Crypto Converter Team" }],
  creator: "Crypto Converter Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crypto-converter.app",
    title: "Crypto Converter | Real-Time Cryptocurrency Conversion",
    description: "A sleek and powerful desktop application for real-time cryptocurrency conversion and tracking.",
    siteName: "Crypto Converter",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Crypto Converter App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Converter | Real-Time Cryptocurrency Conversion",
    description: "A sleek and powerful desktop application for real-time cryptocurrency conversion and tracking.",
    images: ["/images/twitter-image.jpg"],
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
      >
        {children}
      </body>
    </html>
  );
}
