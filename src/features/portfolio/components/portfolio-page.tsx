import { getLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { buildPortfolio, getResume, localizeResume } from '@/lib/resume/load';
import { PortfolioHeader } from './portfolio-header';
import { HeroSection } from './hero-section';
import { ProjectsSection } from './projects-section';
import { ExperienceSection } from './experience-section';
import { ContactSection } from './contact-section';
import { sortWorkByStartDate } from '../model/presentation';

export async function PortfolioPage() {
  const currentLocale = await getLocale();
  const locale = hasLocale(routing.locales, currentLocale) ? currentLocale : routing.defaultLocale;
  const portfolio = buildPortfolio();
  const { basics, projects, work } = localizeResume({ ...getResume('react'), ...portfolio }, locale);
  return (
    <div className="pf-shell">
      <PortfolioHeader />
      <main id="main" tabIndex={-1}>
        <HeroSection basics={basics} projectCount={projects.length} />
        <ProjectsSection projects={projects} />
        <ExperienceSection work={sortWorkByStartDate(work)} />
        <ContactSection basics={basics} />
      </main>
    </div>
  );
}
