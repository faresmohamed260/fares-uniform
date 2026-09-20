import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { requirePublicLocale, publicDirection } from "@/lib/locale";
import "../globals.css";

const latin = Inter({ subsets: ["latin"], variable: "--font-latin", display: "swap" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic", display: "swap" });

type Props = Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = requirePublicLocale(rawLocale);
  return <html lang={locale} dir={publicDirection(locale)} className={`${latin.variable} ${arabic.variable}`}><body>{children}</body></html>;
}
