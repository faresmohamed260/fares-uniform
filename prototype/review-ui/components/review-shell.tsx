"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import {
  ArrowRight,
  Box,
  Check,
  Clock,
  Factory,
  Languages,
  MessageCircle,
  Package,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ReviewSurface = "pos" | "order" | "production" | "public";
type Lang = "en" | "ar";

type Product = {
  id: string;
  en: string;
  ar: string;
  variantEn: string;
  variantAr: string;
  clientEn: string;
  clientAr: string;
  tone: "navy" | "charcoal" | "white" | "black" | "stone";
  kind: "top" | "trouser" | "jacket" | "apron";
  price: number;
};

type CartLine = Product & { qty: number };

const products: Product[] = [
  { id: "polo", en: "School Polo", ar: "قميص بولو مدرسي", variantEn: "Navy · M", variantAr: "كحلي · M", clientEn: "North Coast Academy", clientAr: "أكاديمية الساحل الشمالي", tone: "navy", kind: "top", price: 350 },
  { id: "trousers", en: "School Trousers", ar: "بنطلون مدرسي", variantEn: "Charcoal · 12Y", variantAr: "فحمي · 12Y", clientEn: "North Coast Academy", clientAr: "أكاديمية الساحل الشمالي", tone: "charcoal", kind: "trouser", price: 650 },
  { id: "chef", en: "Chef Jacket", ar: "جاكيت شيف", variantEn: "White · 42", variantAr: "أبيض · 42", clientEn: "Maison Bistro", clientAr: "ميزون بيسترو", tone: "white", kind: "jacket", price: 720 },
  { id: "apron", en: "Restaurant Apron", ar: "مريلة مطعم", variantEn: "Black · One size", variantAr: "أسود · مقاس واحد", clientEn: "Maison Bistro", clientAr: "ميزون بيسترو", tone: "black", kind: "apron", price: 280 },
  { id: "housekeeping", en: "Housekeeping Shirt", ar: "قميص هاوس كيبنج", variantEn: "Stone · L", variantAr: "حجري · L", clientEn: "Alexandria Hospitality", clientAr: "الضيافة بالإسكندرية", tone: "stone", kind: "top", price: 410 },
];

const initialCart: CartLine[] = [
  { ...products[0], qty: 2 },
  { ...products[1], qty: 1 },
];

const spring = { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.72 };
const softSpring = { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.9 };

function t(lang: Lang, en: string, ar: string) {
  return lang === "ar" ? ar : en;
}

function money(lang: Lang, value: number) {
  return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}

function useBrowserReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function ProductArt({ product, compact = false }: { product: Product; compact?: boolean }) {
  const tone = {
    navy: "from-slate-200 via-slate-50 to-emerald-50 text-slate-800",
    charcoal: "from-zinc-200 via-stone-50 to-zinc-100 text-zinc-700",
    white: "from-emerald-950 via-emerald-800 to-teal-700 text-white",
    black: "from-neutral-300 via-stone-100 to-amber-50 text-neutral-900",
    stone: "from-stone-300 via-orange-50 to-stone-100 text-stone-700",
  }[product.tone];

  return (
    <div className={`relative grid overflow-hidden bg-gradient-to-br ${tone} ${compact ? "h-32" : "h-44 sm:h-52"}`}>
      <div className="absolute -start-10 -top-12 size-32 rounded-full bg-white/45 blur-2xl" />
      <div className="absolute -end-12 -bottom-16 size-40 rounded-full bg-emerald-400/20 blur-3xl" />
      <svg viewBox="0 0 180 150" aria-hidden="true" className="relative z-10 m-auto h-[78%] w-[78%] drop-shadow-[0_18px_18px_rgba(7,25,20,.2)]">
        {product.kind === "trouser" ? (
          <path d="M58 24h64l-7 100-22-2-3-57-4 57-22 2z" fill="currentColor" />
        ) : product.kind === "apron" ? (
          <>
            <path d="M72 25c4-13 32-13 36 0l4 18 18 11-19 74H69L50 54l18-11z" fill="currentColor" />
            <path d="M74 23c9 10 23 10 32 0" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="2" />
          </>
        ) : (
          <>
            <path d="M60 34 78 22h24l18 12 27 18-15 25-16-10v62H64V67L48 77 33 52z" fill="currentColor" />
            {product.kind === "jacket" && <path d="M90 25v104M83 52h14" fill="none" stroke="rgba(255,255,255,.72)" strokeWidth="2" />}
          </>
        )}
      </svg>
      <div className="absolute bottom-3 start-3 z-20 rounded-full border border-white/50 bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-emerald-950 shadow-sm backdrop-blur-md">
        {product.clientEn}
      </div>
    </div>
  );
}

function AmbientPhysics({ reduced }: { reduced: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f4f7f4]" aria-hidden="true">
      <motion.div
        data-motion="morph-orb"
        className="absolute -start-24 top-8 h-80 w-80 bg-emerald-300/35 blur-3xl"
        style={reduced ? { borderRadius: "50%", transform: "none" } : undefined}
        animate={reduced ? undefined : {
          x: [0, 90, 18, 0],
          y: [0, 36, 112, 0],
          scale: [1, 1.16, 0.92, 1],
          borderRadius: ["44% 56% 63% 37% / 45% 42% 58% 55%", "62% 38% 42% 58% / 36% 61% 39% 64%", "38% 62% 57% 43% / 63% 38% 62% 37%", "44% 56% 63% 37% / 45% 42% 58% 55%"],
        }}
        transition={reduced ? undefined : { duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        data-motion="morph-orb-secondary"
        className="absolute end-[-8rem] top-[28%] h-[28rem] w-[28rem] bg-teal-200/35 blur-3xl"
        style={reduced ? { borderRadius: "50%", transform: "none" } : undefined}
        animate={reduced ? undefined : {
          x: [0, -80, -25, 0],
          y: [0, 90, -20, 0],
          rotate: [0, 18, -11, 0],
          scale: [1.05, 0.9, 1.18, 1.05],
          borderRadius: ["62% 38% 55% 45% / 47% 59% 41% 53%", "35% 65% 37% 63% / 61% 34% 66% 39%", "59% 41% 68% 32% / 38% 67% 33% 62%", "62% 38% 55% 45% / 47% 59% 41% 53%"],
        }}
        transition={reduced ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function SurfaceHeader({ lang, title, subtitle, status, offline = false }: { lang: Lang; title: string; subtitle: string; status?: string; offline?: boolean }) {
  return (
    <header className="mb-7 flex flex-wrap items-center gap-3 border-b border-emerald-950/10 pb-5 sm:gap-5">
      <div className="flex items-center gap-3">
        <motion.div layout className="grid size-10 place-items-center rounded-2xl bg-emerald-950 text-xs font-black tracking-[.18em] text-white shadow-lg shadow-emerald-950/15">FU</motion.div>
        <div className="hidden sm:block">
          <div className="text-sm font-bold tracking-tight text-emerald-950">Fares Uniform</div>
          <div className="text-[10px] font-semibold uppercase tracking-[.18em] text-emerald-800/55">ERP review system</div>
        </div>
      </div>
      <div className="min-w-[12rem] flex-1 sm:ps-3">
        <h1 className="text-xl font-semibold tracking-[-.035em] text-emerald-950 sm:text-2xl">{title}</h1>
        <p className="mt-0.5 text-xs text-emerald-950/55 sm:text-sm">{subtitle}</p>
      </div>
      {status && (
        <motion.div layout transition={spring}>
          <Badge variant="outline" className={`h-8 gap-1.5 rounded-full border px-3 shadow-sm backdrop-blur-xl ${offline ? "border-amber-300 bg-amber-50/85 text-amber-800" : "border-emerald-200 bg-white/75 text-emerald-800"}`}>
            {offline ? <WifiOff className="size-3.5" /> : <Wifi className="size-3.5" />}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={status} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={spring}>{status}</motion.span>
            </AnimatePresence>
          </Badge>
        </motion.div>
      )}
      <Button variant="outline" size="icon" aria-label={t(lang, "Switch to Arabic", "Switch to English")} render={<a href={`?lang=${lang === "ar" ? "en" : "ar"}`} />}>
        <Languages />
      </Button>
    </header>
  );
}

function ProductGrid({ lang, reduced, onAdd, query, onQuery }: { lang: Lang; reduced: boolean; onAdd: (product: Product) => void; query: string; onQuery: (query: string) => void }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) => `${product.en} ${product.ar} ${product.variantEn} ${product.variantAr} ${product.clientEn} ${product.clientAr}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <section aria-label={t(lang, "Products", "المنتجات")} className="min-w-0">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-emerald-950/45" />
          <Input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder={t(lang, "Search or scan barcode", "بحث أو مسح الباركود")}
            className="h-11 rounded-xl border-emerald-950/10 bg-white/75 ps-9 shadow-sm backdrop-blur-xl focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
          />
        </div>
        <Button variant="outline" className="h-11 rounded-xl bg-white/70 backdrop-blur-xl">{t(lang, "All uniforms", "كل الزي")}</Button>
      </div>

      <LayoutGroup id="pos-products">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {filtered.map((product, index) => (
            <motion.div
              layout
              key={product.id}
              data-motion="product-spring-card"
              initial={reduced ? false : { opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...softSpring, delay: reduced ? 0 : index * 0.035 }}
              whileHover={reduced ? undefined : { y: -8, rotateX: 2.5, rotateY: index % 2 ? -1.5 : 1.5, scale: 1.018 }}
              whileTap={reduced ? undefined : { scale: 0.975 }}
              style={{ transformPerspective: 850 }}
            >
              <Card className="h-full border-0 bg-white/80 py-0 shadow-[0_10px_35px_rgba(7,40,31,.07)] ring-1 ring-emerald-950/10 backdrop-blur-xl transition-shadow hover:shadow-[0_22px_60px_rgba(7,40,31,.14)]">
                <Button
                  variant="ghost"
                  data-testid={`pos-product-${product.id}`}
                  className="h-auto w-full flex-col items-stretch justify-start gap-0 overflow-hidden rounded-xl p-0 text-start hover:bg-transparent"
                  onClick={() => onAdd(product)}
                >
                  <ProductArt product={product} compact />
                  <div className="flex w-full items-end justify-between gap-2 p-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-emerald-950">{t(lang, product.en, product.ar)}</span>
                      <span className="mt-0.5 block truncate text-[11px] text-emerald-950/50">{t(lang, product.variantEn, product.variantAr)}</span>
                    </span>
                    <Badge className="rounded-full bg-emerald-100 text-[10px] text-emerald-900 hover:bg-emerald-100">{t(lang, "Add", "أضف")}</Badge>
                  </div>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </LayoutGroup>
    </section>
  );
}

function CartPanel({ lang, reduced, cart, offline, payment, onOffline, onPayment }: { lang: Lang; reduced: boolean; cart: CartLine[]; offline: boolean; payment: "cash" | "instapay"; onOffline: () => void; onPayment: (payment: "cash" | "instapay") => void }) {
  const total = cart.reduce((sum, line) => sum + line.qty * line.price, 0);
  return (
    <Card data-testid="pos-cart" className="overflow-hidden border-0 bg-white/85 py-0 shadow-[0_30px_80px_rgba(3,31,23,.17)] ring-1 ring-emerald-950/12 backdrop-blur-2xl">
      <CardHeader className="border-b border-emerald-950/8 py-4">
        <CardTitle className="text-xl tracking-[-.035em] text-emerald-950">{t(lang, "Current order", "الطلب الحالي")}</CardTitle>
        <CardDescription>{t(lang, "Walk-in customer · live cart", "عميل مباشر · سلة حالية")}</CardDescription>
        <CardAction>
          <Button data-testid="pos-sync-toggle" variant="ghost" size="sm" className="rounded-full p-0" onClick={onOffline}>
            <motion.span layout transition={spring} className={`flex h-8 items-center gap-1.5 rounded-full px-3 ${offline ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
              {offline ? <WifiOff className="size-3.5" /> : <Wifi className="size-3.5" />}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={offline ? "pending" : "synced"} initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={spring}>
                  {offline ? t(lang, "Pending sync", "في انتظار المزامنة") : t(lang, "Synced", "متزامن")}
                </motion.span>
              </AnimatePresence>
            </motion.span>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-2 py-3">
        <AnimatePresence initial={false} mode="popLayout">
          {cart.map((line) => (
            <motion.div
              layout
              key={line.id}
              data-testid={`cart-line-${line.id}`}
              initial={reduced ? false : { opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: -8, scale: 0.96 }}
              transition={spring}
            >
              <Card size="sm" className="gap-0 bg-emerald-950/[.025] py-2 ring-1 ring-emerald-950/8">
                <CardContent className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-emerald-950">{t(lang, line.en, line.ar)}</div>
                    <div className="truncate text-[10px] text-emerald-950/50">{t(lang, line.variantEn, line.variantAr)}</div>
                  </div>
                  <Badge variant="outline" className="rounded-full bg-white/80 tabular-nums">× {line.qty}</Badge>
                  <strong className="text-xs tabular-nums text-emerald-950">{money(lang, line.price * line.qty)}</strong>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>

      <Separator />
      <CardContent className="space-y-3 py-4">
        <div className="flex items-end justify-between gap-3">
          <span className="text-sm text-emerald-950/55">{t(lang, "Total", "الإجمالي")}</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.strong key={total} initial={reduced ? false : { scale: 1.18, y: -7 }} animate={{ scale: 1, y: 0 }} transition={spring} className="text-3xl font-semibold tracking-[-.055em] text-emerald-950 tabular-nums">
              {money(lang, total)}
            </motion.strong>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-2" role="group" aria-label={t(lang, "Payment method", "طريقة الدفع")}>
          {(["cash", "instapay"] as const).map((method) => {
            const selected = payment === method;
            return (
              <Button
                key={method}
                data-testid={`payment-${method}`}
                aria-pressed={selected}
                variant="outline"
                className="relative h-12 overflow-hidden rounded-xl border-emerald-950/10 bg-white/60 px-3 text-emerald-950 hover:bg-white"
                onClick={() => onPayment(method)}
              >
                {selected && (
                  <motion.span
                    data-motion="payment-shared-highlight"
                    layoutId="payment-selection"
                    className="absolute inset-0 rounded-xl bg-emerald-950"
                    transition={spring}
                  />
                )}
                <span className={`relative z-10 flex w-full items-center justify-between ${selected ? "text-white" : ""}`}>
                  <span>{method === "cash" ? t(lang, "Cash", "نقدي") : t(lang, "InstaPay", "إنستاباي")}</span>
                  <motion.span animate={selected && !reduced ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={spring} className={`grid size-5 place-items-center rounded-full border ${selected ? "border-white/30 bg-white/15" : "border-emerald-950/15"}`}>
                    {selected && <Check className="size-3" />}
                  </motion.span>
                </span>
              </Button>
            );
          })}
        </div>

        <Button size="lg" className="group h-12 w-full rounded-xl bg-emerald-950 text-white shadow-lg shadow-emerald-950/15 hover:bg-emerald-900">
          <span className="flex-1 text-start">{t(lang, "Complete payment", "إتمام الدفع")}</span>
          <motion.span animate={reduced ? undefined : { x: [0, 3, 0] }} transition={reduced ? undefined : { duration: 1.4, repeat: Infinity }}><ArrowRight className="rtl:rotate-180" /></motion.span>
        </Button>

        <AnimatePresence initial={false}>
          {offline && (
            <motion.div data-testid="offline-note" initial={reduced ? false : { height: 0, opacity: 0, y: -6 }} animate={{ height: "auto", opacity: 1, y: 0 }} exit={reduced ? undefined : { height: 0, opacity: 0, y: -6 }} transition={spring} className="overflow-hidden rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800 ring-1 ring-amber-200">
              {t(lang, "This sale stays safely on this device until the server confirms synchronization.", "سيظل هذا البيع محفوظًا بأمان على هذا الجهاز حتى يؤكد الخادم المزامنة.")}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function PosSurface({ lang, reduced }: { lang: Lang; reduced: boolean }) {
  const [cart, setCart] = useState<CartLine[]>(initialCart);
  const [query, setQuery] = useState("");
  const [offline, setOffline] = useState(lang === "ar");
  const [payment, setPayment] = useState<"cash" | "instapay">("cash");

  const addProduct = (product: Product) => {
    setCart((current) => {
      const existing = current.find((line) => line.id === product.id);
      return existing
        ? current.map((line) => line.id === product.id ? { ...line, qty: line.qty + 1 } : line)
        : [...current, { ...product, qty: 1 }];
    });
  };

  const productPanel = <ProductGrid lang={lang} reduced={reduced} onAdd={addProduct} query={query} onQuery={setQuery} />;
  const cartPanel = <CartPanel lang={lang} reduced={reduced} cart={cart} offline={offline} payment={payment} onOffline={() => setOffline((value) => !value)} onPayment={setPayment} />;

  return (
    <main data-surface="pos">
      <SurfaceHeader lang={lang} title={t(lang, "Point of sale", "نقطة البيع")} subtitle={t(lang, "Prebuilt controls. Fast checkout. Visible sync state.", "مكونات جاهزة. دفع سريع. حالة مزامنة واضحة.")} status={offline ? t(lang, "Pending sync", "في انتظار المزامنة") : t(lang, "Online · synced", "متصل · متزامن")} offline={offline} />
      <div className="hidden grid-cols-[minmax(0,1fr)_minmax(350px,430px)] gap-5 lg:grid xl:gap-7">
        {productPanel}
        <aside className="sticky top-4 self-start">{cartPanel}</aside>
      </div>
      <Tabs defaultValue={lang === "ar" ? "cart" : "products"} className="lg:hidden">
        <TabsList className="mb-4 grid h-10 w-full grid-cols-2 rounded-xl bg-emerald-950/5 p-1">
          <TabsTrigger value="products" className="rounded-lg">{t(lang, "Products", "المنتجات")}</TabsTrigger>
          <TabsTrigger value="cart" className="rounded-lg">{t(lang, "Cart & payment", "السلة والدفع")}</TabsTrigger>
        </TabsList>
        <TabsContent value="products">{productPanel}</TabsContent>
        <TabsContent value="cart">{cartPanel}</TabsContent>
      </Tabs>
    </main>
  );
}

function OrderSurface({ lang, reduced }: { lang: Lang; reduced: boolean }) {
  const stages = [
    ["Order received", "تم استلام الطلب"],
    ["In production", "قيد الإنتاج"],
    ["Finished", "تم التصنيع"],
    ["Ready for collection", "جاهز للاستلام"],
  ] as const;
  const [stage, setStage] = useState(1);
  const progress = [22, 52, 76, 100][stage];

  return (
    <main data-surface="order">
      <SurfaceHeader lang={lang} title={t(lang, "Preorder · FU-1048", "طلب مسبق · FU-1048")} subtitle={t(lang, "Balance, fulfillment and pickup context in one place", "الرصيد والتنفيذ والاستلام في مكان واحد")} status={t(lang, stages[stage][0], stages[stage][1])} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,.6fr)]">
        <div className="space-y-5">
          <Card className="border-0 bg-white/82 shadow-[0_20px_70px_rgba(7,40,31,.1)] ring-1 ring-emerald-950/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl tracking-[-.04em] text-emerald-950">{t(lang, "Mariam Hassan", "مريم حسن")}</CardTitle>
              <CardDescription>{t(lang, "Pickup · 18 September · North Coast Academy", "الاستلام · 18 سبتمبر · أكاديمية الساحل الشمالي")}</CardDescription>
              <CardAction><Badge variant="outline" className="rounded-full bg-amber-50 text-amber-800">{t(lang, "Balance due", "رصيد مستحق")}</Badge></CardAction>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {[
                [t(lang, "Order total", "إجمالي الطلب"), money(lang, 1350)],
                [t(lang, "Paid", "المدفوع"), money(lang, 700)],
                [t(lang, "Remaining", "المتبقي"), money(lang, 650)],
              ].map(([label, value], index) => (
                <motion.div key={label} whileHover={reduced ? undefined : { y: -5, scale: 1.015 }} transition={spring}>
                  <Card size="sm" className={`h-full py-3 ${index === 2 ? "bg-amber-50 ring-amber-200" : index === 1 ? "bg-emerald-50 ring-emerald-200" : "bg-emerald-950/[.025]"}`}>
                    <CardContent className="space-y-1 px-3">
                      <div className="text-[11px] text-emerald-950/50">{label}</div>
                      <div className="text-xl font-semibold tracking-[-.04em] text-emerald-950 tabular-nums">{value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
            <CardContent className="pt-1">
              <Progress value={progress} className="gap-2">
                <ProgressLabel className="text-xs text-emerald-950">{t(lang, "Fulfillment journey", "رحلة التنفيذ")}</ProgressLabel>
                <ProgressValue className="text-xs" />
              </Progress>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/78 ring-1 ring-emerald-950/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>{t(lang, "Status preview", "معاينة الحالة")}</CardTitle>
              <CardDescription>{t(lang, "The active state springs between maintained buttons to demonstrate the final interaction language.", "تنتقل الحالة النشطة بحركة نابضية بين الأزرار الجاهزة لإظهار لغة التفاعل النهائية.")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-4">
              {stages.map(([en, ar], index) => (
                <Button key={en} variant="outline" className="relative min-h-14 overflow-hidden rounded-xl px-3" onClick={() => setStage(index)} aria-pressed={stage === index}>
                  {stage === index && <motion.span data-motion="order-stage-highlight" layoutId="order-stage" className="absolute inset-0 rounded-xl bg-emerald-950" transition={spring} />}
                  <span className={`relative z-10 text-wrap text-xs ${stage === index ? "text-white" : "text-emerald-950"}`}>{t(lang, en, ar)}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/78 ring-1 ring-emerald-950/10 backdrop-blur-xl">
            <CardHeader><CardTitle>{t(lang, "Items", "العناصر")}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {initialCart.map((line, index) => (
                <motion.div layout key={line.id} initial={reduced ? false : { opacity: 0, x: lang === "ar" ? 18 : -18 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: index * 0.06 }}>
                  <Card size="sm" className="py-2 ring-1 ring-emerald-950/8">
                    <CardContent className="flex items-center gap-3 px-3">
                      <div className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-900"><Package className="size-4" /></div>
                      <div className="min-w-0 flex-1"><div className="text-xs font-semibold">{t(lang, line.en, line.ar)}</div><div className="text-[10px] text-muted-foreground">{t(lang, line.variantEn, line.variantAr)}</div></div>
                      <Badge variant="outline" className="rounded-full">× {line.qty}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <motion.div whileHover={reduced ? undefined : { y: -6 }} transition={spring}>
            <Card className="border-0 bg-emerald-950 text-white shadow-2xl shadow-emerald-950/20 ring-0">
              <CardHeader><CardTitle className="text-white">{t(lang, "Collection rule", "قاعدة الاستلام")}</CardTitle><CardDescription className="text-white/60">{t(lang, "One financial guardrail", "قاعدة مالية واحدة")}</CardDescription></CardHeader>
              <CardContent className="text-sm leading-relaxed text-white/80">{t(lang, "The entire remaining balance must be settled before any part of this preorder is released.", "يجب تسوية كامل الرصيد المتبقي قبل تسليم أي جزء من هذا الطلب المسبق.")}</CardContent>
              <CardFooter className="border-white/10 bg-white/5 text-xs text-white/65"><Check className="me-2 size-4 text-emerald-300" />{t(lang, "Payment state stays separate from collected quantities", "حالة الدفع منفصلة عن الكميات المستلمة")}</CardFooter>
            </Card>
          </motion.div>
          <Card className="border-0 bg-white/78 ring-1 ring-emerald-950/10 backdrop-blur-xl">
            <CardHeader><CardTitle>{t(lang, "Next action", "الإجراء التالي")}</CardTitle></CardHeader>
            <CardContent><Button className="h-11 w-full rounded-xl bg-emerald-950">{t(lang, "Record balance payment", "تسجيل سداد الرصيد")}</Button></CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

const productionTasks = [
  { id: "polo-m", titleEn: "School Polo · Navy · M", titleAr: "بولو مدرسي · كحلي · M", clientEn: "North Coast Academy", clientAr: "أكاديمية الساحل الشمالي", qty: 18, dueEn: "Due in 5 days", dueAr: "متبقي 5 أيام", progress: 58 },
  { id: "trouser-12", titleEn: "School Trousers · 12Y", titleAr: "بنطلون مدرسي · 12Y", clientEn: "North Coast Academy", clientAr: "أكاديمية الساحل الشمالي", qty: 11, dueEn: "Deadline trigger", dueAr: "محفز الموعد", progress: 31 },
  { id: "chef-42", titleEn: "Chef Jacket · 42", titleAr: "جاكيت شيف · 42", clientEn: "Maison Bistro", clientAr: "ميزون بيسترو", qty: 24, dueEn: "Quantity trigger", dueAr: "محفز الكمية", progress: 76 },
];

function ProductionSurface({ lang, reduced }: { lang: Lang; reduced: boolean }) {
  const [expanded, setExpanded] = useState<string | null>("polo-m");
  return (
    <main data-surface="production">
      <SurfaceHeader lang={lang} title={t(lang, "Production queue", "قائمة الإنتاج")} subtitle={t(lang, "Exact variant demand. Explicit triggers. Human start state.", "طلب حسب المتغير الدقيق. محفزات واضحة. بدء يدوي.")} status={t(lang, "3 active tasks", "3 مهام نشطة")} />
      <LayoutGroup id="production-tasks">
        <div className="grid gap-4 lg:grid-cols-3">
          {productionTasks.map((task, index) => {
            const open = expanded === task.id;
            return (
              <motion.div key={task.id} layout data-motion="production-expand-card" transition={spring} whileHover={reduced ? undefined : { y: -6 }}>
                <Card className={`h-full border-0 bg-white/82 shadow-[0_18px_55px_rgba(7,40,31,.08)] ring-1 backdrop-blur-xl transition-colors ${open ? "ring-emerald-500/40" : "ring-emerald-950/10"}`}>
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-emerald-950 text-white"><Factory className="size-4" /></div>
                    <CardTitle className="text-base text-emerald-950">{t(lang, task.titleEn, task.titleAr)}</CardTitle>
                    <CardDescription>{t(lang, task.clientEn, task.clientAr)}</CardDescription>
                    <CardAction><Badge variant={index === 1 ? "outline" : "secondary"} className="rounded-full">{t(lang, task.dueEn, task.dueAr)}</Badge></CardAction>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-end justify-between"><span className="text-xs text-muted-foreground">{t(lang, "Demand", "الطلب")}</span><strong className="text-3xl tracking-[-.05em] text-emerald-950 tabular-nums">{task.qty}</strong></div>
                    <Progress value={task.progress}><ProgressLabel className="text-xs">{t(lang, "Preparation", "التجهيز")}</ProgressLabel><ProgressValue className="text-xs" /></Progress>
                    <Button variant="outline" className="w-full rounded-xl" aria-expanded={open} onClick={() => setExpanded(open ? null : task.id)}>{open ? t(lang, "Collapse details", "إخفاء التفاصيل") : t(lang, "Expand task", "فتح المهمة")}</Button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div initial={reduced ? false : { height: 0, opacity: 0, scale: 0.97 }} animate={{ height: "auto", opacity: 1, scale: 1 }} exit={reduced ? undefined : { height: 0, opacity: 0, scale: 0.97 }} transition={spring} className="overflow-hidden">
                          <div className="rounded-xl bg-emerald-950 p-3 text-xs leading-relaxed text-white/75">
                            <div className="mb-2 flex items-center gap-2 font-semibold text-white"><Sparkles className="size-3.5 text-emerald-300" />{t(lang, "Morphing task detail", "تفاصيل مهمة متحركة")}</div>
                            {t(lang, "Demand stays tied to this exact design and size. Creating the task does not claim production has started.", "يبقى الطلب مرتبطًا بهذا التصميم والمقاس بدقة. إنشاء المهمة لا يعني أن الإنتاج بدأ.")}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </LayoutGroup>
    </main>
  );
}

function PublicSurface({ lang, reduced }: { lang: Lang; reduced: boolean }) {
  const [selected, setSelected] = useState<Product | null>(null);
  return (
    <main data-surface="public">
      <SurfaceHeader lang={lang} title={t(lang, "Fares Uniform", "فارس يونيفورم")} subtitle={t(lang, "Uniform programs built around your identity", "برامج زي موحد مبنية حول هويتك")} />

      <section className="relative mb-7 overflow-hidden rounded-[2rem] bg-emerald-950 px-5 py-10 text-white shadow-[0_35px_100px_rgba(3,31,23,.26)] sm:px-9 sm:py-14 lg:px-14 lg:py-16">
        <motion.div
          data-motion="hero-morph"
          className="absolute -end-16 -top-20 h-72 w-72 bg-emerald-300/25 blur-2xl"
          style={reduced ? { borderRadius: "50%", transform: "none" } : undefined}
          animate={reduced ? undefined : { rotate: [0, 28, -15, 0], scale: [1, 1.24, 0.9, 1], borderRadius: ["38% 62% 51% 49% / 55% 38% 62% 45%", "64% 36% 32% 68% / 38% 61% 39% 62%", "45% 55% 67% 33% / 67% 35% 65% 33%", "38% 62% 51% 49% / 55% 38% 62% 45%"] }}
          transition={reduced ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 max-w-3xl">
          <Badge className="mb-5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white backdrop-blur-md hover:bg-white/10"><Sparkles className="me-1 size-3.5 text-emerald-300" />{t(lang, "Design · sample · manufacture · deliver", "تصميم · عينة · تصنيع · تسليم")}</Badge>
          <h2 className="max-w-2xl text-4xl font-semibold tracking-[-.065em] sm:text-5xl lg:text-6xl">{t(lang, "A uniform system that moves like your business does.", "نظام زي موحد يتحرك بإيقاع أعمالك.")}</h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">{t(lang, "Explore representative school, hospitality and restaurant programs. Product details stay enquiry-led—no public prices or stock exposure.", "استكشف نماذج للمدارس والضيافة والمطاعم. تفاصيل المنتجات موجهة للاستفسار دون عرض أسعار أو مخزون للعامة.")}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            <Button size="lg" className="rounded-xl bg-white text-emerald-950 hover:bg-emerald-50"><MessageCircle />{t(lang, "Start a project", "ابدأ مشروعًا")}</Button>
            <Button size="lg" variant="outline" className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Phone />{t(lang, "Talk to us", "تحدث معنا")}</Button>
          </div>
        </div>
      </section>

      <section aria-label={t(lang, "Uniform collection", "مجموعة الزي")}>
        <div className="mb-4 flex items-end justify-between gap-4"><div><div className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-800/50">{t(lang, "Selected programs", "برامج مختارة")}</div><h3 className="mt-1 text-2xl font-semibold tracking-[-.04em] text-emerald-950">{t(lang, "Explore by garment", "استكشف حسب القطعة")}</h3></div><Badge variant="outline" className="hidden rounded-full bg-white/65 sm:flex">{t(lang, "Enquiry only", "للاستفسار فقط")}</Badge></div>
        <LayoutGroup id="public-catalog">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product, index) => (
              <motion.div key={product.id} data-motion="catalog-spring-card" whileHover={reduced ? undefined : { y: -11, rotateZ: index % 2 ? -0.8 : 0.8, scale: 1.015 }} whileTap={reduced ? undefined : { scale: 0.98 }} transition={spring}>
                <Card className="h-full border-0 bg-white/80 py-0 shadow-[0_14px_45px_rgba(7,40,31,.08)] ring-1 ring-emerald-950/10 backdrop-blur-xl">
                  <Button data-testid={`public-product-${product.id}`} variant="ghost" className="h-auto w-full flex-col items-stretch gap-0 overflow-hidden rounded-xl p-0 text-start hover:bg-transparent" onClick={() => setSelected(product)}>
                    <motion.div layoutId={`catalog-art-${product.id}`} transition={spring}><ProductArt product={product} /></motion.div>
                    <div className="flex w-full items-end justify-between gap-3 p-4"><span><strong className="block text-base text-emerald-950">{t(lang, product.en, product.ar)}</strong><span className="mt-1 block text-xs text-muted-foreground">{t(lang, product.clientEn, product.clientAr)}</span></span><span className="grid size-9 place-items-center rounded-full bg-emerald-950 text-white"><ArrowRight className="size-4 rtl:rotate-180" /></span></div>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
      </section>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <DialogContent data-testid="public-product-dialog" className="max-h-[88vh] max-w-3xl overflow-auto rounded-[1.75rem] border-0 bg-white/95 p-0 shadow-2xl ring-1 ring-emerald-950/10 backdrop-blur-2xl sm:max-w-3xl">
            <div className="grid md:grid-cols-[.9fr_1.1fr]">
              <motion.div layoutId={`catalog-art-${selected.id}`} transition={spring} data-motion="shared-product-morph"><ProductArt product={selected} /></motion.div>
              <div className="p-5 sm:p-7">
                <DialogHeader>
                  <Badge className="mb-2 w-fit rounded-full bg-emerald-100 text-emerald-900 hover:bg-emerald-100">{t(lang, "Uniform program", "برنامج زي موحد")}</Badge>
                  <DialogTitle className="text-2xl tracking-[-.045em] text-emerald-950">{t(lang, selected.en, selected.ar)}</DialogTitle>
                  <DialogDescription>{t(lang, selected.clientEn, selected.clientAr)} · {t(lang, selected.variantEn, selected.variantAr)}</DialogDescription>
                </DialogHeader>
                <div className="my-5 space-y-3 text-sm leading-relaxed text-emerald-950/65">
                  <p>{t(lang, "This detail surface intentionally morphs from the selected catalog card while Base UI keeps dialog focus, dismissal and keyboard behavior accessible.", "تتحول شاشة التفاصيل بصريًا من بطاقة المنتج المختارة بينما تحافظ Base UI على التركيز والإغلاق واستخدام لوحة المفاتيح بشكل ميسر.")}</p>
                  <Card size="sm" className="bg-emerald-950/[.035] ring-1 ring-emerald-950/8"><CardContent className="flex items-center gap-3 px-3"><Box className="size-4 text-emerald-700" /><span>{t(lang, "Client-specific design · separate product identity", "تصميم خاص بالعميل · هوية منتج مستقلة")}</span></CardContent></Card>
                </div>
                <DialogFooter className="mx-0 mb-0 rounded-xl border-0 bg-emerald-50 p-3 sm:flex-row">
                  <Button className="rounded-xl bg-emerald-950">{t(lang, "Enquire about this uniform", "استفسر عن هذا الزي")}</Button>
                </DialogFooter>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </main>
  );
}

export function ReviewShell({ surface, lang }: { surface: ReviewSurface; lang: Lang }) {
  const reduced = useBrowserReducedMotion();
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <div
      className="review-root relative min-h-screen overflow-x-clip bg-transparent text-emerald-950"
      data-reduced-motion={reduced ? "true" : "false"}
      data-component-foundation="shadcn-base-ui"
      dir={lang === "ar" ? "rtl" : "ltr"}
      lang={lang}
    >
      <AmbientPhysics reduced={reduced} />
      <div className="mx-auto min-h-screen w-full max-w-[1540px] px-4 py-5 sm:px-6 lg:px-9 lg:py-7">
        {surface === "pos" && <PosSurface lang={lang} reduced={reduced} />}
        {surface === "order" && <OrderSurface lang={lang} reduced={reduced} />}
        {surface === "production" && <ProductionSurface lang={lang} reduced={reduced} />}
        {surface === "public" && <PublicSurface lang={lang} reduced={reduced} />}
      </div>
    </div>
  );
}
