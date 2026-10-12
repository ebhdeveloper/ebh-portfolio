import { describe, expect, it } from "vitest";
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
