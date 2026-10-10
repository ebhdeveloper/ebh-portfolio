import { buildPortfolio, getResume } from "@/lib/resume/load";
import { PortfolioHeader } from "./portfolio-header";
import { HeroSection } from "./hero-section";
import { ProjectsSection } from "./projects-section";
import { ExperienceSection } from "./experience-section";
import { ContactSection } from "./contact-section";
import { sortWorkByStartDate } from "../model/presentation";

export function PortfolioPage() {
  const { basics } = getResume("react");
  const { projects, work } = buildPortfolio();
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
