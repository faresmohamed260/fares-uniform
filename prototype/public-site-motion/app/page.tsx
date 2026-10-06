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

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const locale: Locale = params.lang === "ar" ? "ar" : "en";
  const requestedProject = projects.find(
    (item) => item.id === params.organization && (!params.program || item.programId === params.program),
  );
  const project = requestedProject ?? projects[0];
  const cohortId = params.cohort ?? params.role;
  const lookId = params.look ?? params.garment;

  return (
    <PatternExperience
      initialLocale={locale}
      initialProjectId={project.id}
      initialCohortId={cohortId}
      initialLookId={lookId}
    />
  );
}
