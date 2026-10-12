"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useStore } from "zustand";
import { useScrollReveal } from "@/components/ui/use-scroll-reveal";
import type { PortfolioProject, ResumeLocale } from "@/lib/resume/types";
import { createProjectFilterStore, filterProjects, type ProjectFilter } from "../model/project-filter";
import { ProjectCard } from "./project-card";

const filters: readonly ProjectFilter[] = ["all", "web", "mobile"];

export function ProjectsSection({ projects }: { projects: (PortfolioProject & { locale?: ResumeLocale })[] }) {
  const t = useTranslations("Portfolio");
  const format = useFormatter();
  const [store] = useState(createProjectFilterStore);
  const filter = useStore(store, (state) => state.filter);
  const setFilter = useStore(store, (state) => state.setFilter);
  const visible = filterProjects(projects, filter);
  const revealRef = useScrollReveal<HTMLElement>(visible.map((project) => project.id).join(","));

  return (
    <section ref={revealRef} id="work" className="pf-work" aria-labelledby="work-title">
      <div className="pf-section-heading" data-scroll-reveal="">
        <div><p className="pf-eyebrow">01 / {t("work")}</p><h2 id="work-title">{t("workTitle")}</h2></div>
        <p>{t("workSubtitle")}</p>
      </div>
      <div className="pf-work-toolbar" data-scroll-reveal="">
        <div className="pf-filters" role="group" aria-label={t("filtersLabel")}>
          {filters.map((value) => (
            <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{t(value)}</button>
          ))}
        </div>
        <p className="pf-result-count" role="status" aria-live="polite">{t("results", { count: format.number(visible.length) })}</p>
      </div>
      {visible.length > 0 ? (
        <div className="pf-work-grid">{visible.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      ) : <p className="pf-empty">{t("empty")}</p>}
    </section>
  );
}
