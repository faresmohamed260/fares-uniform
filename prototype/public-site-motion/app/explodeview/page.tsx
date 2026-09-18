import { PatternExperience } from "@/components/pattern-experience";
import { projects, type Locale } from "@/lib/projects";

type Params = {
  lang?: string;
  organization?: string;
  program?: string;
  cohort?: string;
  role?: string;
  look?: string;
  garment?: string;
};

type Props = { searchParams: Promise<Params> };

export default async function ExplodeViewPage({ searchParams }: Props) {
  const params = await searchParams;
  const locale: Locale = params.lang === "ar" ? "ar" : "en";
  const requestedProject = projects.find((project) =>
    project.id === params.organization && (!params.program || project.programId === params.program)
  );
  const project = requestedProject ?? projects[0];
  const requestedCohortId = params.cohort ?? params.role;
  const cohort = project.cohorts.find((item) => item.id === requestedCohortId) ?? project.cohorts[0];
  const requestedLookId = params.look ?? params.garment;
  const look = project.looks.find((item) => item.id === requestedLookId && cohort.lookIds.includes(item.id));

  return (
    <PatternExperience
      initialLocale={locale}
      initialProjectId={project.id}
      initialCohortId={cohort.id}
      initialLookId={look?.id}
      initialExploded
    />
  );
}
