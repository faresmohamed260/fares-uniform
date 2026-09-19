import { ExplodeExperience } from "@/components/explode-experience";
import { projects, type Locale } from "@/lib/projects";

type Params = { lang?: string; organization?: string; program?: string; cohort?: string; role?: string; look?: string; garment?: string };
type Props = { searchParams: Promise<Params> };

export default async function ExplodeViewPage({ searchParams }: Props) {
  const params = await searchParams;
  const locale: Locale = params.lang === "ar" ? "ar" : "en";
  const requestedProject = projects.find((item) => item.id === params.organization && (!params.program || item.programId === params.program));
  const project = requestedProject ?? projects[0];
  const cohort = project.cohorts.find((item) => item.id === (params.cohort ?? params.role)) ?? project.cohorts[0];
  const look = project.looks.find((item) => item.id === (params.look ?? params.garment) && cohort.lookIds.includes(item.id))
    ?? project.looks.find((item) => cohort.lookIds.includes(item.id))
    ?? project.looks[0];

  return <ExplodeExperience project={project} cohort={cohort} look={look} initialLocale={locale} />;
}
