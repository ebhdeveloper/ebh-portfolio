import { projectLinkKinds, type Resume } from "./types";

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

// A translation belongs to its record; it cannot replace shared identity or dates.
function translation(record: Record<string, unknown>, path: string, keys: string[]) {
  if (record.translations === undefined) return;
  const translations = object(record.translations, `${path}.translations`);
  if (Object.keys(translations).some(key => key !== "fa")) fail(`${path}.translations`, "supports only fa (English is the base)");
  if (translations.fa === undefined) return;
  const translated = object(translations.fa, `${path}.translations.fa`);
  const allowed = [...keys, ...(path === "basics" ? ["label", "summary", "availability", "location"] : []), ...(path.startsWith("work[") ? ["highlights"] : [])];
  if (Object.keys(translated).some(key => !allowed.includes(key))) fail(`${path}.translations.fa`, "contains a non-translatable field");
  keys.forEach(key => string(translated[key], `${path}.translations.fa.${key}`));
  if (path === "basics") {
    for (const key of ["label", "summary", "availability"]) {
      if (record[key] !== undefined) string(translated[key], `${path}.translations.fa.${key}`);
      else if (translated[key] !== undefined) fail(`${path}.translations.fa.${key}`, "has no English source");
    }
    const location = record.location !== undefined ? object(record.location, `${path}.location`) : undefined;
    if (translated.location !== undefined) {
      const translatedLocation = object(translated.location, `${path}.translations.fa.location`);
      if (Object.keys(translatedLocation).some(key => key !== "city")) fail(`${path}.translations.fa.location`, "may translate only city");
      if (location?.city === undefined) fail(`${path}.translations.fa.location.city`, "has no English source");
      string(translatedLocation.city, `${path}.translations.fa.location.city`);
    } else if (location?.city !== undefined) fail(`${path}.translations.fa.location.city`, "must translate the source city");
  }
  if (path.startsWith("work[")) {
    strings(translated.highlights, `${path}.translations.fa.highlights`);
    if ((translated.highlights as string[]).length !== (record.highlights as string[]).length) fail(`${path}.translations.fa.highlights`, "must match the English highlights count");
  }
}

export function validateResume(input: unknown): Resume {
  const resume = object(input, "resume");
  const basics = object(resume.basics, "basics");
  string(basics.name, "basics.name");
  string(basics.email, "basics.email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basics.email)) fail("basics.email", "must be an email address");
  optionalStrings(basics, ["label", "summary", "availability"], "basics");
  ["url", "linkedin", "portfolio"].forEach((key) => {
    if (basics[key] !== undefined) url(basics[key], `basics.${key}`);
  });
  if (basics.location !== undefined) {
    optionalStrings(object(basics.location, "basics.location"), ["city", "countryCode"], "basics.location");
  }

  translation(basics, "basics", ["name"]);

  const workIds = new Set<string>();
  items(resume, "work", (entry, path) => {
    uniqueId(entry, path, workIds);
    ["company", "position", "location"].forEach((key) => string(entry[key], `${path}.${key}`));
    strings(entry.highlights, `${path}.highlights`);
    translation(entry, path, ["company", "position", "location"]);
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
    if (entry.includeInResume !== undefined && typeof entry.includeInResume !== "boolean") fail(`${path}.includeInResume`, "must be a boolean");
    translation(entry, path, ["title", "description"]);
    if (entry.links !== undefined) {
      const links = object(entry.links, `${path}.links`);
      projectLinkKinds.forEach((key) => {
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
    translation(entry, path, ["name"]);
  });
  items(resume, "education", (entry, path) => {
    ["institution", "area", "studyType"].forEach((key) => string(entry[key], `${path}.${key}`));
    translation(entry, path, ["institution", "area", "studyType"]);
  });
  if (resume.languages !== undefined) {
    items(resume, "languages", (entry, path) => {
      ["language", "fluency"].forEach(key => string(entry[key], `${path}.${key}`));
      translation(entry, path, ["language", "fluency"]);
    });
  }
  // The guards above check every field of the public Resume contract.
  return input as Resume;
}
