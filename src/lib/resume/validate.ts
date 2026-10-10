import type { Resume } from "./types";

function fail(path: string, message: string): never {
  throw new Error(`Invalid resume: ${path} ${message}`);
}

function object(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(path, "must be an object");
  }
  return value as Record<string, unknown>;
}

function string(value: unknown, path: string): asserts value is string {
  if (typeof value !== "string" || !value.trim()) fail(path, "must be a nonblank string");
}

function strings(value: unknown, path: string) {
  if (!Array.isArray(value)) fail(path, "must be an array");
  value.forEach((entry, index) => string(entry, `${path}[${index}]`));
}

function optionalStrings(record: Record<string, unknown>, keys: string[], path: string) {
  keys.forEach((key) => {
    if (record[key] !== undefined) string(record[key], `${path}.${key}`);
  });
}

function url(value: unknown, path: string) {
  string(value, path);
  let parsed: URL;
  try { parsed = new URL(value); } catch { fail(path, "must be an HTTP(S) URL"); }
  if (!["http:", "https:"].includes(parsed.protocol)) fail(path, "must be an HTTP(S) URL");
}

// Year-only dates retain the precision supplied in the original resume.
function dateRange(value: unknown, path: string): [number, number] {
  string(value, path);
  if (!/^[1-9]\d{3}(?:-(?:0[1-9]|1[0-2]))?$/.test(value)) fail(path, "must be YYYY or YYYY-MM with a valid month");
  const [year, month] = value.split("-").map(Number);
  return month ? [year * 12 + month, year * 12 + month] : [year * 12 + 1, year * 12 + 12];
}

function items(record: Record<string, unknown>, key: string, validate: (entry: Record<string, unknown>, path: string) => void) {
  const value = record[key];
  if (!Array.isArray(value)) fail(key, "must be an array");
  value.forEach((entry, index) => {
    const path = `${key}[${index}]`;
    validate(object(entry, path), path);
  });
}

function uniqueId(entry: Record<string, unknown>, path: string, seen: Set<string>) {
  string(entry.id, `${path}.id`);
  if (seen.has(entry.id)) fail(`${path}.id`, "must be unique within this collection");
  seen.add(entry.id);
}

export function validateResume(input: unknown): Resume {
  const resume = object(input, "resume");
  const basics = object(resume.basics, "basics");
  string(basics.name, "basics.name");
  string(basics.email, "basics.email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basics.email)) fail("basics.email", "must be an email address");
  optionalStrings(basics, ["label", "summary"], "basics");
  ["url", "linkedin"].forEach((key) => {
    if (basics[key] !== undefined) url(basics[key], `basics.${key}`);
  });
  if (basics.location !== undefined) {
    optionalStrings(object(basics.location, "basics.location"), ["city", "countryCode"], "basics.location");
  }

  const workIds = new Set<string>();
  items(resume, "work", (entry, path) => {
    uniqueId(entry, path, workIds);
    ["company", "position", "location"].forEach((key) => string(entry[key], `${path}.${key}`));
    strings(entry.highlights, `${path}.highlights`);
    const [start] = dateRange(entry.startDate, `${path}.startDate`);
    if (entry.endDate !== undefined) {
      const [, end] = dateRange(entry.endDate, `${path}.endDate`);
      if (end < start) fail(`${path}.endDate`, "must not precede startDate");
    }
  });

  const projectIds = new Set<string>();
  items(resume, "projects", (entry, path) => {
    uniqueId(entry, path, projectIds);
    ["title", "description"].forEach((key) => string(entry[key], `${path}.${key}`));
    if (!["web", "mobile", "both"].includes(entry.type as string)) fail(`${path}.type`, "must be web, mobile or both");
    strings(entry.technologies, `${path}.technologies`);
    if (entry.links !== undefined) {
      const links = object(entry.links, `${path}.links`);
      ["website", "github", "appStore", "googlePlay"].forEach((key) => {
        if (links[key] !== undefined) url(links[key], `${path}.links.${key}`);
      });
    }
    if (entry.image !== undefined) {
      string(entry.image, `${path}.image`);
      const segments = entry.image.slice(1).split("/");
      if (!entry.image.startsWith("/images/") || /[\\?#%\s]/.test(entry.image) ||
          segments.some((segment) => !segment || segment === "." || segment === "..")) {
        fail(`${path}.image`, "must be a local path beneath /images/ without traversal or URL escapes");
      }
    }
  });

  items(resume, "skills", (entry, path) => {
    string(entry.name, `${path}.name`);
    strings(entry.keywords, `${path}.keywords`);
  });
  items(resume, "education", (entry, path) => {
    ["institution", "area", "studyType"].forEach((key) => string(entry[key], `${path}.${key}`));
  });
  // The guards above check every field of the public Resume contract.
  return input as Resume;
}
