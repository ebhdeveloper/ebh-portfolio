import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import type { PortfolioProject, ResumeLocale } from "@/lib/resume/types";
import { getProjectLinks } from "../model/presentation";

export function ProjectCard({ project }: { project: PortfolioProject & { locale?: ResumeLocale } }) {
  const t = useTranslations("Portfolio");
  const links = getProjectLinks(project);
  return (
    <article className="pf-project">
      <div className="pf-project-art" data-art={project.id} data-platform={project.type}>
        {project.image ? (
          <Image className="pf-project-image" src={project.image} alt={project.title} width={800} height={600} unoptimized />
        ) : (
          <div className="pf-project-abstract" aria-hidden="true">
            <div className="pf-project-shape" />
            <span lang={project.locale ?? "en"} dir={project.locale === "fa" ? "rtl" : "ltr"}>{project.title}</span>
            <span className="pf-art-caption">{project.type === "mobile" ? "APPLICATION" : "DIGITAL PRODUCT"}</span>
          </div>
        )}
        <span className="pf-platform">{t(project.type)}</span>
      </div>
      <div className="pf-project-heading">
        <h3 lang={project.locale ?? "en"} dir={project.locale === "fa" ? "rtl" : "ltr"}>{project.title}</h3>
        <span className="pf-project-index" aria-hidden="true"><ArrowIcon /></span>
      </div>
      <p className="pf-project-description" lang={project.locale ?? "en"} dir={project.locale === "fa" ? "rtl" : "ltr"}>{project.description}</p>
      {project.technologies.length > 0 && (
        <ul className="pf-tags" aria-label={t("technologies")} lang="en" dir="ltr">
          {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      )}
      {links.length > 0 && (
        <div className="pf-project-links">
          {links.map(({ kind, url }) => (
            <a key={kind} href={url} target="_blank" rel="noopener noreferrer">
              {t(kind === "website" ? "visit" : kind)}<ArrowIcon />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
