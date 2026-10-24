import type { ResumeDocumentModel } from "./presentation";
import type { ResumeLocale } from "../../../lib/resume/types";

export const resumeLocationMaxLength = 120;

export function normalizeResumeLocation(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, resumeLocationMaxLength);
}

export function applyResumeLocation(document: ResumeDocumentModel, value: string) {
  const location = normalizeResumeLocation(value);
  const locationLocale: ResumeLocale = location
    ? (/\p{Script=Arabic}/u.test(location) ? "fa" : "en")
    : document.basics.locale;
  return { ...document, location: location || document.location, locationLocale };
}
