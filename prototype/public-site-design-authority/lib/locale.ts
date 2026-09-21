export type Locale = "en" | "ar";

export function requireLocale(value: string): Locale {
  if (value === "en" || value === "ar") return value;
  throw new Error("Unsupported locale");
}

export function direction(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}
