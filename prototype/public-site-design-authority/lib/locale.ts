import { notFound } from "next/navigation";

export type Locale = "en" | "ar";

export function requireLocale(value: string): Locale {
  if (value === "en" || value === "ar") return value;
  notFound();
}

export function direction(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}
