import { PatternExperience } from "@/components/pattern-experience";
import type { Locale } from "@/lib/projects";

type Props = { searchParams: Promise<{ lang?: string }> };

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const locale: Locale = params.lang === "ar" ? "ar" : "en";
  return <PatternExperience initialLocale={locale} />;
}
