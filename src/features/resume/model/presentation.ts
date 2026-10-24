import { localizeResume } from "../../../lib/resume/localize";
import { projectLinkKinds, type Resume, type ResumeProfile, type ResumeLocale } from "../../../lib/resume/types";

export const resumeProfiles = [
  { id: "react", label: "React" },
  { id: "react-native", label: "React Native" },
  { id: "fullstack", label: "Fullstack" },
] as const satisfies readonly { id: ResumeProfile; label: string }[];

export function isResumeProfile(value: string): value is ResumeProfile {
  return resumeProfiles.some(profile => profile.id === value);
}

export function formatResumeDate(value?: string, locale: ResumeLocale = "en") {
  if (!value) return locale === "fa" ? "اکنون" : "Present";
  if (value.length === 4) return locale === "fa" ? new Intl.NumberFormat("fa", { useGrouping: false }).format(Number(value)) : value;
  const [year, month] = value.split("-").map(Number);
  // Keep the source Gregorian calendar in both languages; do not invent date precision.
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR-u-ca-gregory" : "en", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1)));
}

const labels = {
  en: { curriculum: "Curriculum vitae", profile: "Professional Summary", expertise: "Technical Skills", experience: "Professional Experience", projects: "Projects", education: "Education", languages: "Languages", portfolio: "Portfolio", resume: "resume", website: "Website", github: "Source", appStore: "App Store", googlePlay: "Google Play", cafeBazaar: "Cafe Bazaar" },
  fa: { curriculum: "رزومهٔ حرفه‌ای", profile: "معرفی", expertise: "مهارت‌ها", experience: "سوابق کاری", projects: "پروژه‌ها", education: "تحصیلات", languages: "زبان‌ها", portfolio: "پورتفولیو", resume: "رزومه", website: "وب‌سایت", github: "کد پروژه", appStore: "اپ استور", googlePlay: "گوگل پلی", cafeBazaar: "کافه‌بازار" },
} as const;

// The supplied font lacks some non-ASCII hyphens. Keep the canonical JSON intact.
function text(value: string) {
  return value.replace(/[\u2010-\u2014]/g, "-");
}

export function buildResumeDocument(profile: ResumeProfile, source: Resume, locale: ResumeLocale = "en") {
  const resume = localizeResume(source, locale);
  const { basics } = resume;
  const headings = labels[locale];
  const profileLabel = resumeProfiles.find(entry => entry.id === profile)!.label;
  const projects = resume.projects.filter(project => project.includeInResume !== false);
  const countryCode = basics.location?.countryCode;
  const country = countryCode && /^[A-Z]{2}$/.test(countryCode)
    ? new Intl.DisplayNames([locale], { type: "region" }).of(countryCode)
    : countryCode;
  return {
    profile,
    profileLabel,
    compactProjects: projects.length > 3,
    locale,
    direction: locale === "fa" ? "rtl" as const : "ltr" as const,
    headings,
    fileName: `Ebrahim-Hamidi-${profile}-CV${locale === "fa" ? "-fa" : ""}.pdf`,
    basics: { ...basics, name: text(basics.name), ...(basics.label ? { label: text(basics.label) } : {}), ...(basics.summary ? { summary: text(basics.summary) } : {}), ...(basics.availability ? { availability: text(basics.availability) } : {}) },
    locationLocale: basics.locale,
    location: [basics.location?.city, country].filter(Boolean).join(", "),
    contacts: [
      { label: basics.email, url: `mailto:${basics.email}` },
      ...(basics.url ? [{ label: basics.url.replace(/^https?:\/\//, ""), url: basics.url }] : []),
      ...(basics.portfolio ? [{ label: basics.portfolio.replace(/^https?:\/\//, ""), url: basics.portfolio }] : []),
      ...(basics.linkedin ? [{ label: basics.linkedin.replace(/^https?:\/\//, ""), url: basics.linkedin }] : []),
    ],
    work: [...resume.work].sort((a, b) => b.startDate.localeCompare(a.startDate)).map(job => ({ ...job, company: text(job.company), position: text(job.position), location: ["Location not specified", "محل همکاری مشخص نشده"].includes(job.location) ? "" : text(job.location), highlights: job.highlights.map(text), period: `${formatResumeDate(job.startDate, locale)} - ${formatResumeDate(job.endDate, locale)}` })),
    projects: projects.map(project => ({
      ...project,
      title: text(project.title),
      description: text(project.description),
      technologies: project.technologies.map(text),
      links: projectLinkKinds.flatMap(kind => {
        const url = project.links?.[kind];
        return url ? [{ label: headings[kind], url }] : [];
      }),
    })),
    skills: resume.skills.map(skill => ({ locale: skill.locale, name: text(skill.name), keywords: skill.keywords.map(text) })),
    education: resume.education.map(entry => ({ locale: entry.locale, institution: text(entry.institution), area: text(entry.area), studyType: text(entry.studyType) })),
    languages: resume.languages.map(entry => ({ locale: entry.locale, language: text(entry.language), fluency: text(entry.fluency) })),
    isIncomplete: !basics.summary && !resume.work.length && !projects.length && !resume.skills.length && !resume.education.length,
  };
}

export type ResumeDocumentModel = ReturnType<typeof buildResumeDocument>;
