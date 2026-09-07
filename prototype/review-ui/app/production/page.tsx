import { ReviewShell } from "@/components/review-shell";

type PageProps = { searchParams: Promise<{ lang?: string }> };

export default async function ProductionPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <ReviewShell surface="production" lang={params.lang === "ar" ? "ar" : "en"} />;
}
