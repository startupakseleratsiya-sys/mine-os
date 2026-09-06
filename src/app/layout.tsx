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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-finance-tutor.vercel.app"),
  title: {
    default: "Finora — O'zbek tilida AI Moliya Ustozi",
    template: "%s | Finora",
  },
  description:
    "Shaxsiy budjet, jamg'arma va investitsiya asoslarini o'zbek tilida o'rganing. AI moliya ustozi, amaliy kurslar va kalkulyatorlar bilan moliyaviy savodxonligingizni oshiring.",
  keywords: [
    "moliya", "finance", "AI tutor", "moliyaviy savodxonlik",
    "o'zbek", "investitsiya", "budjet", "jamg'arma", "kredit kalkulyatori",
  ],
  authors: [{ name: "Finora" }],
  creator: "Finora",
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    title: "Finora — O'zbek tilida AI Moliya Ustozi",
    description:
      "Shaxsiy budjet, jamg'arma va investitsiya asoslari. O'zbek tilidagi AI moliyaviy o'qituvchi.",
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
