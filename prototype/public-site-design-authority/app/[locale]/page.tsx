import { ApprovedHomepage } from "@/components/approved-homepage";
import { requireLocale } from "@/lib/locale";

export default async function Home({params}:{params:Promise<{locale:string}>}){
  const locale=requireLocale((await params).locale);
  return <ApprovedHomepage locale={locale}/>;
}
