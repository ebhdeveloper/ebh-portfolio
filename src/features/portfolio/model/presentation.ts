import type { PortfolioProject, WorkExperience } from "../../../lib/resume/types";

export function sortWorkByStartDate<T extends WorkExperience>(work: readonly T[]) {
  return [...work].sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export function getProjectLinks(project: PortfolioProject) {
  const kinds = ["website", "github", "appStore", "googlePlay"] as const;
  return kinds.flatMap((kind) => {
    const url = project.links?.[kind];
    return url ? [{ kind, url }] : [];
  });
}
