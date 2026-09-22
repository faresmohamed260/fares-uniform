import type { Metadata } from "next";
import { Bodoni_Moda, Manrope, Noto_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { ScrollcraftRuntime } from "@/components/scrollcraft-runtime";
import { direction, type Locale } from "@/lib/locale";
import "../globals.css";
import "../approved-homepage.css";

const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic", display: "swap" });

export const metadata: Metadata = {
  title: "Fares Uniform — Scrollcraft design review",
  description: "Protected Scrollcraft design authority review for the Fares Uniform public site.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const rawLocale = (await params).locale;
  if (rawLocale !== "en" && rawLocale !== "ar") notFound();
  const locale: Locale = rawLocale;

  return (
    <html lang={locale} dir={direction(locale)} className={`${display.variable} ${sans.variable} ${arabic.variable}`}>
      <head>
        <link rel="stylesheet" href="/scrollcraft/scrollcraft.css" />
      </head>
      <body>
        <SiteShell locale={locale}>{children}</SiteShell>
        <ScrollcraftRuntime />
      </body>
    </html>
  );
}
