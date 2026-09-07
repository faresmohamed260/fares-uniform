import { ReviewShell } from "@/components/review-shell";

type PageProps = { searchParams: Promise<{ lang?: string }> };

export default async function PosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <ReviewShell surface="pos" lang={params.lang === "ar" ? "ar" : "en"} />;
}
