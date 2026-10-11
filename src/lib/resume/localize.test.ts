import { describe, expect, it } from "vitest";
import { getResume, getLocalizedResume, localizeResume } from "./load";
import { validateResume } from "./validate";
import { makeResume, makeWork, makeProject } from "./test-fixtures";

function bilingualSource() {
  return {
    ...makeResume(),
    basics: { ...makeResume().basics, translations: { fa: { name: "ابراهیم حمیدی" } } },
    work: [{ ...makeWork(), translations: { fa: { company: "تقویم", position: "توسعه‌دهندهٔ ارشد", location: "دورکاری", highlights: ["توسعهٔ تقویم موبایل"] } } }],
    projects: [{ ...makeProject(), translations: { fa: { title: "تقویم", description: "تقویم و یادداشت" } } }],
  };
}

describe("localized professional data", () => {
  it("selects Persian text while preserving shared dates, IDs, contacts and technologies", () => {
    const source = bilingualSource();
    const before = structuredClone(source);
    const cv = localizeResume(validateResume(source), "fa");
    expect(cv.basics.name).toBe("ابراهیم حمیدی");
    expect(cv.basics.email).toBe("ebh.developer@gmail.com");
    expect(cv.work[0]).toMatchObject({ id: "taghvim", startDate: "2021-01", endDate: "2022-03", highlights: ["توسعهٔ تقویم موبایل"], locale: "fa" });
    expect(cv.projects[0]).toMatchObject({ id: "calendar", description: "تقویم و یادداشت", technologies: ["React Native"] });
    expect(source).toEqual(before);
  });
  it("keeps English content independent from the Persian translation", () => {
    const cv = localizeResume(validateResume(bilingualSource()), "en");
    expect(cv.basics.name).toBe("Ebrahim Hamidi");
    expect(cv.work[0].highlights).toEqual(["Built native calendar navigation."]);
    expect(cv.work[0].locale).toBe("en");
  });
  it("shows newly added records without translations with an explicit English fallback", () => {
    const source = bilingualSource();
    const input = { ...source, work: [...source.work, makeWork({ id: "new-job" })] };
    const cv = localizeResume(validateResume(input), "fa");
    expect(cv.work[1]).toMatchObject({ id: "new-job", locale: "en", highlights: ["Built native calendar navigation."] });
  });
  it("rejects malformed translations rather than silently producing a broken resume", () => {
    const source = bilingualSource();
    expect(() => validateResume({ ...source, work: [{ ...source.work[0], translations: { fa: { ...source.work[0].translations.fa, highlights: [] } } }] })).toThrow(/highlights/);
    expect(() => validateResume({ ...source, projects: [{ ...source.projects[0], translations: { fa: { title: "تقویم" } } }] })).toThrow(/description/);
    expect(() => validateResume({ ...source, basics: { ...source.basics, translations: { fa: { name: " " } } } })).toThrow(/name/);
  });
  it.each(["react", "react-native", "fullstack"])("localizes every supplied record in %s without inventing or dropping entries", profile => {
    const en = getResume(profile);
    const fa = getLocalizedResume(profile, "fa");
    expect(fa.basics.name).toBe("ابراهیم حمیدی");
    for (const key of ["work", "projects", "skills", "education"] as const) {
      expect(fa[key]).toHaveLength(en[key].length);
      expect(fa[key].every(entry => entry.locale === "fa")).toBe(true);
    }
  });
});


describe("translation boundaries", () => {
  it("never accepts contacts, dates, IDs or country codes inside translations", () => {
    const source = bilingualSource();
    expect(() => validateResume({ ...source, work: [{ ...source.work[0], translations: { fa: { ...source.work[0].translations.fa, startDate: "2099" } } }] })).toThrow(/non-translatable/);
    expect(() => validateResume({ ...source, basics: { ...source.basics, translations: { fa: { name: "ابراهیم", email: "other@example.com" } } } })).toThrow(/non-translatable/);
    expect(() => validateResume({ ...source, basics: { ...source.basics, location: { countryCode: "IR" }, translations: { fa: { name: "ابراهیم", location: { countryCode: "FR" } } } } })).toThrow(/city/);
  });
});
