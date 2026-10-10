import { createStore } from "zustand/vanilla";
import type { PortfolioProject } from "../../../lib/resume/types";

export type ProjectFilter = "all" | "web" | "mobile";

export function filterProjects(projects: readonly PortfolioProject[], filter: ProjectFilter) {
  return filter === "all"
    ? projects
    : projects.filter((project) => project.type === filter || project.type === "both");
}

export function createProjectFilterStore() {
  return createStore<{
    filter: ProjectFilter;
    setFilter: (filter: ProjectFilter) => void;
  }>((set) => ({
    filter: "all",
    setFilter: (filter) => set({ filter }),
  }));
}
