import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";
import { getI18n } from "@/i18n/server";
import { I18nProvider } from "@/i18n/provider";

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
    default: "Finora — Finance and PPP learning",
    template: "%s | Finora",
  },
  description:
    "Learn finance and public-private partnerships in English. Practice with lessons, original questions and an AI tutor.",
  keywords: [
    "finance", "PPP", "public-private partnership", "CP3P", "AI tutor",
    "financial literacy", "investment", "budgeting", "savings", "loan calculator",
  ],
  authors: [{ name: "Finora" }],
  creator: "Finora",
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "Finora — Finance and PPP learning",
    description: "Learn finance and public-private partnerships in English with lessons, practice questions and an AI tutor.",
    siteName: "Finora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finora — Finance and PPP learning",
    description: "Financial freedom starts with learning.",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, messages } = await getI18n();
  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
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
          <I18nProvider locale={locale} messages={messages}>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
