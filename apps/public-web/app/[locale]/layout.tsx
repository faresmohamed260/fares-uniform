import { Cormorant_Garamond, Inter, Noto_Naskh_Arabic, Noto_Sans_Arabic } from "next/font/google";
import { requirePublicLocale, publicDirection } from "@/lib/locale";
import "../globals.css";

const latin = Inter({ subsets: ["latin"], variable: "--font-latin", display: "swap" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic", display: "swap" });
const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
});
const arabicDisplay = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic-display",
  display: "swap",
  weight: ["400", "500", "600"],
});

type Props = Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = requirePublicLocale(rawLocale);
  return (
    <html
      lang={locale}
      dir={publicDirection(locale)}
      className={`${latin.variable} ${arabic.variable} ${display.variable} ${arabicDisplay.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
