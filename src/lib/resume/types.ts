export type ResumeLocale = "en" | "fa";

export type ResumeTranslations<T> = { fa?: T };

export type ResumeProfile = "react" | "react-native" | "fullstack";

export interface ResumeBasics {
  translations?: ResumeTranslations<{ name: string; label?: string; summary?: string; location?: { city?: string } }>;
  name: string;
  email: string;
  label?: string;
  summary?: string;
  url?: string;
  linkedin?: string;
  location?: { city?: string; countryCode?: string };
}

export interface WorkExperience {
  translations?: ResumeTranslations<{ company: string; position: string; location: string; highlights: string[] }>;
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
}

export interface PortfolioProject {
  translations?: ResumeTranslations<{ title: string; description: string }>;
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
  translations?: ResumeTranslations<{ name: string }>;
  name: string;
  keywords: string[];
}

export interface Education {
  translations?: ResumeTranslations<{ institution: string; area: string; studyType: string }>;
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
