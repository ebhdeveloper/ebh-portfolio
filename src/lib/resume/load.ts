import react from "../../data/resumes/react.json";
import reactNative from "../../data/resumes/react-native.json";
import fullstack from "../../data/resumes/fullstack.json";
import type { Resume, ResumeProfile, ResumeSources } from "./types";
import { validateResume } from "./validate";

const profiles = ["react", "react-native", "fullstack"] as const satisfies readonly ResumeProfile[];
const defaultSources: ResumeSources = { react, "react-native": reactNative, fullstack };

export function getResume(profile: string, sources: ResumeSources = defaultSources): Resume {
  if (!profiles.some((known) => known === profile)) {
    throw new Error(`Unknown resume profile: ${profile}`);
  }
  return validateResume(sources[profile as ResumeProfile]);
}

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function buildPortfolio(sources: ResumeSources = defaultSources): Pick<Resume, "work" | "projects"> {
  const resumes = profiles.map((profile) => getResume(profile, sources));
  return {
    work: uniqueById(resumes.flatMap((resume) => resume.work)),
    projects: uniqueById(resumes.flatMap((resume) => resume.projects)),
  };
}
