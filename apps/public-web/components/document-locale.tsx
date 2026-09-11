"use client";

import { useEffect } from "react";
import type { PublicLanguage } from "@/lib/public-data";

export function DocumentLocale({ language }: { language: PublicLanguage }) {
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);
  return null;
}
