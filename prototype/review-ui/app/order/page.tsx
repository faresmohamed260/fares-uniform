import { ReviewShell } from "@/components/review-shell";

type PageProps = { searchParams: Promise<{ lang?: string }> };

export default async function OrderPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <ReviewShell surface="order" lang={params.lang === "ar" ? "ar" : "en"} />;
}
