export type ResumeLocale = "en" | "fa";

export type ResumeTranslations<T> = { fa?: T };

export type ResumeProfile = "react" | "react-native" | "fullstack";

export interface ResumeBasics {
  translations?: ResumeTranslations<{ name: string; label?: string; summary?: string; availability?: string; location?: { city?: string } }>;
  name: string;
  email: string;
  label?: string;
  summary?: string;
  availability?: string;
  portfolio?: string;
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

export const projectLinkKinds = ["website", "github", "appStore", "googlePlay", "cafeBazaar"] as const;

export interface PortfolioProject {
  translations?: ResumeTranslations<{ title: string; description: string }>;
  id: string;
  title: string;
  description: string;
  type: "web" | "mobile" | "both";
  technologies: string[];
  image?: string;
  includeInResume?: boolean;
  links?: Partial<Record<(typeof projectLinkKinds)[number], string>>;
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

export interface ResumeLanguage {
  language: string;
  fluency: string;
  translations?: ResumeTranslations<{ language: string; fluency: string }>;
}

export interface Resume {
  basics: ResumeBasics;
  languages?: ResumeLanguage[];
  work: WorkExperience[];
  projects: PortfolioProject[];
  skills: SkillGroup[];
  education: Education[];
}

export type ResumeSources = Record<ResumeProfile, unknown>;
