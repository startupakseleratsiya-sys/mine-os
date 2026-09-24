import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";
import { getI18n } from "@/i18n/server";
import { I18nProvider } from "@/i18n/provider";
import { LanguageSwitcher } from "@/i18n/language-switcher";

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

const baseMetadata: Metadata = {
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

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  const copy = {
    en: { title: "Finora — Finance and PPP learning", description: "Learn finance and public-private partnerships in English, Russian or Uzbek. Practice with lessons, original questions and an AI tutor.", og: "en_GB" },
    ru: { title: "Finora — Финансы и государственно-частное партнёрство", description: "Изучайте финансы и ГЧП на английском, русском или узбекском. Уроки, практические задания и ИИ-наставник.", og: "ru_RU" },
    uz: { title: "Finora — Moliya va davlat-xususiy sheriklik", description: "Moliya va DXShni ingliz, rus yoki o‘zbek tilida o‘rganing. Darslar, amaliy mashqlar va AI ustoz.", og: "uz_UZ" },
  }[locale];
  return { ...baseMetadata, title: { default: copy.title, template: "%s | Finora" }, description: copy.description, openGraph: { ...baseMetadata.openGraph, locale: copy.og, title: copy.title, description: copy.description }, twitter: { ...baseMetadata.twitter, title: copy.title, description: copy.description } };
}

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
            <LanguageSwitcher />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
