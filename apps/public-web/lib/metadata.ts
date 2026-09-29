import type { Metadata } from "next";
import type { PublicLocale } from "./locale";

function siteOrigin() {
  const configured = process.env.PUBLIC_SITE_ORIGIN?.trim();
  const value = configured || "https://faresuniform.uk";
  return new URL(value.endsWith("/") ? value : `${value}/`);
}

export function publicMetadata(locale: PublicLocale, path: string, title: string, description: string): Metadata {
  const suffix = path ? `/${path.replace(/^\/+|\/+$/g, "")}` : "";
  return {
    metadataBase: siteOrigin(),
    title,
    description,
    alternates: {
      canonical: `/${locale}${suffix}`,
      languages: { en: `/en${suffix}`, ar: `/ar${suffix}` },
    },
    openGraph: {
      type: "website",
      siteName: "Fares Uniform",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      title,
      description,
      url: `/${locale}${suffix}`,
    },
  };
}
