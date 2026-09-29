import { notFound } from "next/navigation";

export const PUBLIC_LOCALES = ["en", "ar"] as const;
export type PublicLocale = (typeof PUBLIC_LOCALES)[number];

export function isPublicLocale(value: string): value is PublicLocale {
  return PUBLIC_LOCALES.includes(value as PublicLocale);
}

export function requirePublicLocale(value: string): PublicLocale {
  if (!isPublicLocale(value)) notFound();
  return value;
}

export function publicDirection(locale: PublicLocale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function alternateLocale(locale: PublicLocale): PublicLocale {
  return locale === "ar" ? "en" : "ar";
}
