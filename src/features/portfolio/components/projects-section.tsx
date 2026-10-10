"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useStore } from "zustand";
import type { PortfolioProject } from "@/lib/resume/types";
import { createProjectFilterStore, filterProjects, type ProjectFilter } from "../model/project-filter";
import { ProjectCard } from "./project-card";

const filters: readonly ProjectFilter[] = ["all", "web", "mobile"];

export function ProjectsSection({ projects }: { projects: PortfolioProject[] }) {
  const t = useTranslations("Portfolio");
  const format = useFormatter();
  const [store] = useState(createProjectFilterStore);
  const filter = useStore(store, (state) => state.filter);
  const setFilter = useStore(store, (state) => state.setFilter);
  const visible = filterProjects(projects, filter);

  return (
    <section id="work" className="pf-work" aria-labelledby="work-title">
      <div className="pf-section-heading">
        <div><p className="pf-eyebrow">01 / {t("work")}</p><h2 id="work-title">{t("workTitle")}</h2></div>
        <p>{t("workSubtitle")}</p>
      </div>
      <div className="pf-work-toolbar">
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
