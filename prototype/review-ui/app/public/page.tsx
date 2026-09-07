import { ReviewShell } from "@/components/review-shell";

type PageProps = { searchParams: Promise<{ lang?: string }> };

export default async function PublicPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <ReviewShell surface="public" lang={params.lang === "ar" ? "ar" : "en"} />;
}
