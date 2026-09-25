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
    default: "Finora — CP3P exam preparation",
    template: "%s | Finora",
  },
  description:
    "Prepare for the APMG CP3P Foundation, Preparation and Execution exams: video, audio and text lessons, a test after every lesson, and exam simulations.",
  keywords: [
    "CP3P", "PPP", "public-private partnership", "APMG", "PPP certification",
    "CP3P Foundation", "CP3P Preparation", "CP3P Execution", "PPP Guide",
  ],
  authors: [{ name: "Finora" }],
  creator: "Finora",
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "Finora — CP3P exam preparation",
    description: "CP3P exam preparation: lessons, tests after every lesson and exam simulations.",
    siteName: "Finora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finora — CP3P exam preparation",
    description: "Pass the CP3P exams, one clear step at a time.",
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
