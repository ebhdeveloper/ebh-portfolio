import { describe, expect, it } from "vitest";
import { buildPortfolio } from "../../../lib/resume/load";
import { makeResume, makeProject, makeWork } from "../../../lib/resume/test-fixtures";
import { getResume } from "../../../lib/resume/load";
import { buildResumeDocument, isResumeProfile, formatResumeDate } from "./presentation";

describe("resume document presentation", () => {
  it("accepts only the three supported profiles", () => {
    for (const profile of ["react", "react-native", "fullstack"]) expect(isResumeProfile(profile)).toBe(true);
    for (const profile of ["React", "native", "../react", "toString", ""]) expect(isResumeProfile(profile)).toBe(false);
  });
  it("keeps each profile isolated and preserves its real title", () => {
    const source = getResume("react-native");
    const document = buildResumeDocument("react-native", source);
    expect(document.basics.label).toBe(source.basics.label);
    expect(document.projects.map(project => project.title)).toContain("Taghvim");
    expect(document.projects.map(project => project.title)).not.toContain("Wonderfruit");
  });
  it("consumes updated JSON records without altering source order", () => {
    const source = structuredClone(getResume("react"));
    source.work.push({ id: "new-job", company: "New Company", position: "Developer", location: "Remote", startDate: "2099-01", highlights: ["Built a new product."] });
    source.projects.push({ id: "new-project", title: "New Product", description: "From updated JSON", type: "web", technologies: [], links: { website: "https://example.com" } });
    const original = structuredClone(source);
    const document = buildResumeDocument("react", source);
    expect(document.work[0].company).toBe("New Company");
    expect(document.projects.at(-1)?.links).toEqual([{ label: "Website", url: "https://example.com" }]);
    expect(source).toEqual(original);
  });
  it("does not invent content for the empty Fullstack profile", () => {
    const document = buildResumeDocument("fullstack", getResume("fullstack"));
    expect(document.isIncomplete).toBe(true);
    expect(document.basics.label).toBeUndefined();
    expect(document.work).toEqual([]);
    expect(document.projects).toEqual([]);
    expect(document.skills).toEqual([]);
    expect(document.education).toEqual([]);
  });
  it("omits optional contact links and keeps every available project link kind", () => {
    const source = structuredClone(getResume("fullstack"));
    delete source.basics.url;
    delete source.basics.linkedin;
    delete source.basics.portfolio;
    delete source.basics.location;
    source.projects.push({ id: "all-links", title: "Application", description: "Available links", type: "both", technologies: [], links: { website: "https://example.com", github: "https://github.com/example", appStore: "https://apps.apple.com/example", googlePlay: "https://play.google.com/example", cafeBazaar: "https://cafebazaar.ir/app/com.example" } });
    const document = buildResumeDocument("fullstack", source);
    expect(document.contacts).toEqual([{ label: source.basics.email, url: `mailto:${source.basics.email}` }]);
    expect(document.location).toBe("");
    expect(document.projects[0].links.map(link => link.label)).toEqual(["Website", "Source", "App Store", "Google Play", "Cafe Bazaar"]);
    expect(document.isIncomplete).toBe(false);
  });
  it("localizes Cafe Bazaar labels while preserving the download URL", () => {
    const source = structuredClone(getResume("fullstack"));
    const url = "https://cafebazaar.ir/app/com.example";
    source.projects.push({ id: "bazaar-app", title: "App", description: "Mobile application.", type: "mobile", technologies: [], links: { cafeBazaar: url } });
    expect(buildResumeDocument("fullstack", source, "fa").projects[0].links).toEqual([{ label: "کافه‌بازار", url }]);
  });
  it("normalizes unsupported typographic hyphens for readable PDF text without changing JSON", () => {
    const source = structuredClone(getResume("fullstack"));
    source.basics.summary = "Cross‑platform and offline–first experience.";
    const document = buildResumeDocument("fullstack", source);
    expect(document.basics.summary).toBe("Cross-platform and offline-first experience.");
    expect(source.basics.summary).toBe("Cross‑platform and offline–first experience.");
  });
  it("retains provided date precision and formats an ongoing role", () => {
    expect(formatResumeDate("2021")).toBe("2021");
    expect(formatResumeDate("2021-01")).toBe("Jan 2021");
    expect(formatResumeDate()).toBe("Present");
  });
});


describe("bilingual document presentation", () => {
  it("uses Persian headings, direction, dates and a language-specific filename", () => {
    const cv = buildResumeDocument("react", getResume("react"), "fa");
    expect(cv.locale).toBe("fa");
    expect(cv.direction).toBe("rtl");
    expect(cv.headings.experience).toBe("سوابق کاری");
    expect(cv.fileName).toBe("Ebrahim-Hamidi-react-CV-fa.pdf");
    expect(cv.work[0].period).toContain("اکنون");
    expect(formatResumeDate("2021-01", "fa")).toBe("ژانویه ۲۰۲۱");
  });
  it("preserves Gregorian year-only precision in both languages", () => {
    expect(formatResumeDate("2021", "fa")).toBe("۲۰۲۱");
    expect(formatResumeDate("2021", "en")).toBe("2021");
  });
});


describe("international application presentation", () => {
  it("renders confirmed languages with localized English fallback", () => {
    const source = makeResume({ languages: [
      { language: "English", fluency: "B1 (actively improving)", translations: { fa: { language: "انگلیسی", fluency: "B1؛ در حال یادگیری" } } },
      { language: "Turkish", fluency: "Intermediate" },
    ] });
    const en = buildResumeDocument("react", source, "en");
    const fa = buildResumeDocument("react", source, "fa");
    expect(en.languages).toEqual([
      { language: "English", fluency: "B1 (actively improving)", locale: "en" },
      { language: "Turkish", fluency: "Intermediate", locale: "en" },
    ]);
    expect(fa.languages).toEqual([
      { language: "انگلیسی", fluency: "B1؛ در حال یادگیری", locale: "fa" },
      { language: "Turkish", fluency: "Intermediate", locale: "en" },
    ]);
    expect(buildResumeDocument("fullstack", makeResume()).languages).toEqual([]);
  });
  it("includes a portfolio contact and spells out the country without inventing work authorization", () => {
    const source = makeResume({ basics: { ...makeResume().basics, location: { city: "Tehran", countryCode: "IR" }, portfolio: "https://example.com", availability: "Open to remote work and relocation" } });
    const cv = buildResumeDocument("react", source);
    expect(cv.location).toBe("Tehran, Iran");
    expect(cv.contacts).toContainEqual({ label: "example.com", url: "https://example.com" });
    expect(cv.basics.availability).toBe("Open to remote work and relocation");
  });
  it("keeps portfolio-only projects on the site while exporting selected and new projects by default", () => {
    const source = makeResume({ projects: [makeProject({ id: "selected" }), makeProject({ id: "portfolio-only", includeInResume: false }), makeProject({ id: "new" })] });
    expect(buildResumeDocument("react", source).projects.map(p => p.id)).toEqual(["selected", "new"]);
    const portfolio = buildPortfolio({ react: source, "react-native": makeResume(), fullstack: makeResume() });
    expect(portfolio.projects.map(p => p.id)).toEqual(["selected", "portfolio-only", "new"]);
    expect(source.projects).toHaveLength(3);
  });
});


describe("application clarity", () => {
  it("omits an unknown workplace location without replacing it with a made-up one", () => {
    const source = makeResume({ work: [makeWork({ id: "unknown-location", location: "Location not specified" }), makeWork({ id: "known-location", location: "Tehran, Iran" })] });
    const cv = buildResumeDocument("react", source);
    expect(cv.work.find(job => job.id === "unknown-location")?.location).toBe("");
    expect(cv.work.find(job => job.id === "known-location")?.location).toBe("Tehran, Iran");
    expect(source.work.find(job => job.id === "unknown-location")?.location).toBe("Location not specified");
  });
});


it("keeps an otherwise empty profile incomplete when its projects are portfolio-only", () => {
  const source = makeResume({ projects: [makeProject({ includeInResume: false })] });
  const cv = buildResumeDocument("fullstack", source);
  expect(cv.projects).toEqual([]);
  expect(cv.isIncomplete).toBe(true);
});


describe("complete mobile project list", () => {
  it.each(["en", "fa"] as const)("keeps all six mobile projects and their links in the %s resume", locale => {
    const source = getResume("react-native");
    const cv = buildResumeDocument("react-native", source, locale);
    expect(cv.projects.map(project => project.id)).toEqual(["dp-lamp", "emzano", "taghvim", "tejarat-bank", "sigma", "khoshkala"]);
    expect(cv.projects.flatMap(project => project.links.map(link => link.url))).toEqual(source.projects.flatMap(project => Object.values(project.links ?? {})));
  });
});


describe("complete web project list", () => {
  it.each(["en", "fa"] as const)("keeps all five web projects and their links in the %s resume", locale => {
    const source = getResume("react");
    const cv = buildResumeDocument("react", source, locale);
    expect(cv.projects.map(project => project.id)).toEqual(["namarang", "beyondgrow", "youtopin", "simkhan", "wonderfruit"]);
    expect(cv.projects.find(project => project.id === "wonderfruit")?.links).toContainEqual({ label: cv.headings.website, url: "https://wonderfruit.co/" });
    expect(cv.projects.flatMap(project => project.links.map(link => link.url))).toEqual(source.projects.flatMap(project => Object.values(project.links ?? {})));
  });
});
