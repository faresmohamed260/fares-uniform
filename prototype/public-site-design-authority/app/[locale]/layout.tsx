import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { direction, requireLocale } from "@/lib/locale";
import "../globals.css";

export const metadata: Metadata = {
  title: "Fares Uniform — Browser-native design review",
  description: "Protected browser-native design review for the Fares Uniform public site.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = requireLocale((await params).locale);
  return (
    <html lang={locale} dir={direction(locale)}>
      <body>
        <SiteShell locale={locale}>{children}</SiteShell>
      </body>
    </html>
  );
}
