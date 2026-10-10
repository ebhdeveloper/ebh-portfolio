import type { PortfolioProject, Resume, WorkExperience } from "./types";

export function makeResume(overrides: Partial<Resume> = {}): Resume {
  return {
    basics: { name: "Ebrahim Hamidi", email: "ebh.developer@gmail.com" },
    work: [],
    projects: [],
    skills: [],
    education: [],
    ...overrides,
  };
}

export function makeWork(overrides: Partial<WorkExperience> = {}): WorkExperience {
  return {
    id: "taghvim",
    company: "Taghvim",
    position: "Senior React Native Engineer",
    location: "Remote (France)",
    startDate: "2021-01",
    endDate: "2022-03",
    highlights: ["Built native calendar navigation."],
    ...overrides,
  };
}

export function makeProject(overrides: Partial<PortfolioProject> = {}): PortfolioProject {
  return {
    id: "calendar",
    title: "Calendar",
    description: "Cross-platform calendar and notes.",
    type: "mobile",
    technologies: ["React Native"],
    ...overrides,
  };
}
