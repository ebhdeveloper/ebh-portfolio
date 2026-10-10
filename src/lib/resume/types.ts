export type ResumeProfile = "react" | "react-native" | "fullstack";

export interface ResumeBasics {
  name: string;
  email: string;
  label?: string;
  summary?: string;
  url?: string;
  linkedin?: string;
  location?: { city?: string; countryCode?: string };
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  type: "web" | "mobile" | "both";
  technologies: string[];
  image?: string;
  links?: {
    website?: string;
    github?: string;
    appStore?: string;
    googlePlay?: string;
  };
}

export interface SkillGroup {
  name: string;
  keywords: string[];
}

export interface Education {
  institution: string;
  area: string;
  studyType: string;
}

export interface Resume {
  basics: ResumeBasics;
  work: WorkExperience[];
  projects: PortfolioProject[];
  skills: SkillGroup[];
  education: Education[];
}

export type ResumeSources = Record<ResumeProfile, unknown>;
