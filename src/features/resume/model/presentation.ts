import type { Resume, ResumeProfile } from "../../../lib/resume/types";

export const resumeProfiles = [
  { id: "react", label: "React" },
  { id: "react-native", label: "React Native" },
  { id: "fullstack", label: "Fullstack" },
] as const satisfies readonly { id: ResumeProfile; label: string }[];

export function isResumeProfile(value: string): value is ResumeProfile {
  return resumeProfiles.some(profile => profile.id === value);
}

export function formatResumeDate(value?: string) {
  if (!value) return "Present";
  if (value.length === 4) return value;
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1)));
}

// The supplied font lacks some non-ASCII hyphens. Keep the canonical JSON intact.
function text(value: string) {
  return value.replace(/[\u2010-\u2014]/g, "-");
}

export function buildResumeDocument(profile: ResumeProfile, resume: Resume) {
  const { basics } = resume;
  const profileLabel = resumeProfiles.find(entry => entry.id === profile)!.label;
  return {
    profile,
    profileLabel,
    fileName: `Ebrahim-Hamidi-${profile}-CV.pdf`,
    basics: { ...basics, name: text(basics.name), ...(basics.label ? { label: text(basics.label) } : {}), ...(basics.summary ? { summary: text(basics.summary) } : {}) },
    location: [basics.location?.city, basics.location?.countryCode].filter(Boolean).join(", "),
    contacts: [
      { label: basics.email, url: `mailto:${basics.email}` },
      ...(basics.url ? [{ label: basics.url.replace(/^https?:\/\//, ""), url: basics.url }] : []),
      ...(basics.linkedin ? [{ label: basics.linkedin.replace(/^https?:\/\//, ""), url: basics.linkedin }] : []),
    ],
    work: [...resume.work].sort((a, b) => b.startDate.localeCompare(a.startDate)).map(job => ({ ...job, company: text(job.company), position: text(job.position), location: text(job.location), highlights: job.highlights.map(text), period: `${formatResumeDate(job.startDate)} - ${formatResumeDate(job.endDate)}` })),
    projects: resume.projects.map(project => ({
      ...project,
      title: text(project.title),
      description: text(project.description),
      technologies: project.technologies.map(text),
      links: ([ ["website", "Website"], ["github", "Source"], ["appStore", "App Store"], ["googlePlay", "Google Play"] ] as const).flatMap(([kind, label]) => {
        const url = project.links?.[kind];
        return url ? [{ label, url }] : [];
      }),
    })),
    skills: resume.skills.map(skill => ({ name: text(skill.name), keywords: skill.keywords.map(text) })),
    education: resume.education.map(entry => ({ institution: text(entry.institution), area: text(entry.area), studyType: text(entry.studyType) })),
    isIncomplete: !basics.summary && !resume.work.length && !resume.projects.length && !resume.skills.length && !resume.education.length,
  };
}

export type ResumeDocumentModel = ReturnType<typeof buildResumeDocument>;
