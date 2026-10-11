import type { Resume, ResumeLocale } from "./types";

function localize<T extends object>(entry: T & { translations?: { fa?: Partial<T> } }, locale: ResumeLocale) {
  const { translations, ...base } = entry;
  const translated = locale === "fa" ? translations?.fa : undefined;
  return { ...base, ...translated, locale: translated ? "fa" : "en" } as Omit<T, "translations"> & { locale: ResumeLocale };
}

// Translate only display fields. Identity, dates, links and technology names stay shared.
export function localizeResume(resume: Resume, locale: ResumeLocale) {
  const basics = localize(resume.basics, locale);
  return {
    locale,
    basics: {
      ...basics,
      ...(resume.basics.location ? { location: { ...resume.basics.location, ...basics.location } } : {}),
    },
    work: resume.work.map(entry => localize(entry, locale)),
    projects: resume.projects.map(entry => localize(entry, locale)),
    skills: resume.skills.map(entry => localize(entry, locale)),
    education: resume.education.map(entry => localize(entry, locale)),
  };
}

export type LocalizedResume = ReturnType<typeof localizeResume>;
