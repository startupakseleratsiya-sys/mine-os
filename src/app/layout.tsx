import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Finora — O'zbek tilida AI Moliya Ustozi",
    template: "%s | Finora",
  },
  description:
    "CP3P, CFA va ACCA imtihonlariga tayyorlaning. O'zbek tilidagi birinchi AI moliyaviy o'qituvchi bilan moliyaviy savodxonligingizni oshiring.",
  keywords: [
    "moliya", "finance", "AI tutor", "CP3P", "CFA", "ACCA",
    "o'zbek", "moliyaviy savodxonlik", "investitsiya", "budjet",
  ],
  authors: [{ name: "Finora" }],
  creator: "Finora",
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://finora.uz",
    title: "Finora — O'zbek tilida AI Moliya Ustozi",
    description:
      "CP3P, CFA va ACCA imtihonlariga tayyorlaning. O'zbek tilidagi birinchi AI moliyaviy o'qituvchi.",
    siteName: "Finora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finora — O'zbek tilida AI Moliya Ustozi",
    description: "Moliyaviy erkinlikka AI bilan yo'l.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#163e32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
