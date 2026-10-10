  import { describe, expect, it } from "vitest";
import { makeProject, makeResume, makeWork } from "./test-fixtures";
import { validateResume } from "./validate";

describe("validateResume", () => {
  it("accepts complete data and an empty profile without inventing records", () => {
    expect(validateResume(makeResume())).toEqual({
      basics: { name: "Ebrahim Hamidi", email: "ebh.developer@gmail.com" },
      work: [], projects: [], skills: [], education: [],
    });
  });

  it.each([null, [], "resume", 42])("rejects a non-object document: %j", (input) => {
    expect(() => validateResume(input)).toThrow(/resume/);
  });

  it.each([
    ["name", ""], ["name", "  "], ["email", undefined], ["email", "not-an-email"],
  ])("rejects an invalid basics.%s", (key, value) => {
    const input = { ...makeResume(), basics: { ...makeResume().basics, [key]: value } };
    expect(() => validateResume(input)).toThrow(new RegExp(`basics\\.${key}`));
  });

  it.each(["work", "projects", "skills", "education"])("requires the %s array", (key) => {
    expect(() => validateResume({ ...makeResume(), [key]: null })).toThrow(new RegExp(key));
  });

  it.each([
    ["company", ""], ["id", " "], ["location", null],
    ["highlights", "text"], ["highlights", [23]], ["position", undefined],
    ["startDate", "2025-13"], ["startDate", "2025-00"], ["startDate", "2025-1"],
    ["endDate", "2020-12"], ["endDate", "2023-14"],
  ])("rejects an invalid work field: %s = %j", (key, value) => {
    const input = { ...makeResume(), work: [{ ...makeWork(), [key]: value }] };
    expect(() => validateResume(input)).toThrow(new RegExp(`work\\[0\\]\\.${key}`));
  });

  it("accepts an ongoing role with no end date and valid same-month dates", () => {
    const ongoing = makeWork();
    delete ongoing.endDate;
    expect(validateResume(makeResume({ work: [ongoing] })).work[0].endDate).toBeUndefined();
    expect(validateResume(makeResume({ work: [makeWork({ endDate: "2021-01" })] })).work[0].endDate).toBe("2021-01");
  });

  it("preserves year precision and accepts overlapping mixed-precision dates", () => {
    const work = [makeWork({ startDate: "2023", endDate: "2024" }), makeWork({ id: "mixed", startDate: "2023-06", endDate: "2023" })];
    expect(validateResume(makeResume({ work })).work).toEqual(work);
  });

  it.each(["0000", "23", "2023-06-01"])("rejects malformed date %s", (startDate) => {
    expect(() => validateResume(makeResume({ work: [makeWork({ startDate })] }))).toThrow(/startDate/);
  });

  it("rejects definitely reversed dates with year precision", () => {
    expect(() => validateResume(makeResume({ work: [makeWork({ startDate: "2024", endDate: "2023-12" })] }))).toThrow(/endDate/);
  });

  it.each([
    ["label", " "], ["summary", 42], ["url", "javascript:alert(1)"],
    ["linkedin", "not-a-url"], ["location", []], ["location", { city: false }],
  ])("rejects malformed optional basics.%s", (key, value) => {
    expect(() => validateResume({ ...makeResume(), basics: { ...makeResume().basics, [key]: value } })).toThrow(new RegExp(`basics\\.${key}`));
  });

  it("rejects repeated experience IDs in one profile", () => {
    expect(() => validateResume(makeResume({ work: [makeWork(), makeWork()] }))).toThrow(/work\[1\]\.id/);
  });

  it("rejects repeated project IDs in one profile", () => {
    expect(() => validateResume(makeResume({ projects: [makeProject(), makeProject()] }))).toThrow(/projects\[1\]\.id/);
  });

  it.each(["web", "mobile", "both"] as const)("accepts project type %s", (type) => {
    expect(validateResume(makeResume({ projects: [makeProject({ type })] })).projects[0].type).toBe(type);
  });

  it.each([
    ["type", "desktop"], ["title", ""], ["description", null], ["technologies", [false]],
    ["links", []], ["links", { website: "javascript:alert(1)" }],
    ["links", { appStore: "not-a-url" }], ["links", { github: "ftp://example.com" }],
  ])("rejects invalid project %s", (key, value) => {
    const input = { ...makeResume(), projects: [{ ...makeProject(), [key]: value }] };
    expect(() => validateResume(input)).toThrow(new RegExp(`projects\\[0\\]\\.${key}`));
  });

  it("preserves supplied HTTPS/HTTP links and a public image path", () => {
    const project = makeProject({
      image: "/images/projects/calendar.png",
      links: { website: "https://example.com/", github: "http://example.com/code" },
    });
    expect(validateResume(makeResume({ projects: [project] })).projects[0]).toEqual(project);
  });

  it.each([
    "https://example.com/image.png", "//example.com/image.png", "/images/../secret.png",
    "/images/%2e%2e/secret.png", "/images/photo.png?remote=true", "/images/", "/images/a\\b.png",
  ])("rejects images outside a canonical local public path: %s", (image) => {
    expect(() => validateResume(makeResume({ projects: [makeProject({ image })] }))).toThrow(/projects\[0\]\.image/);
  });

  it.each([
    ["skills", [{ name: "Mobile", keywords: "React Native" }], /skills\[0\]\.keywords/],
    ["skills", [null], /skills\[0\]/],
    ["education", [{ institution: "Pooyesh", area: "Software", studyType: " " }], /education\[0\]\.studyType/],
  ])("rejects invalid %s items", (key, value, path) => {
    expect(() => validateResume({ ...makeResume(), [key]: value })).toThrow(path);
  });

  it("preserves optional basics, skills and education without changing its input", () => {
    const input = makeResume({
      basics: {
        ...makeResume().basics, label: "Senior React Engineer", summary: "Web and mobile.",
        url: "https://github.com/ebhdeveloper", linkedin: "https://linkedin.com/in/ebrahimhamidi",
        location: { city: "Tehran", countryCode: "IR" },
      },
      skills: [{ name: "Frontend", keywords: ["React", "TypeScript"] }],
      education: [{ institution: "Pooyesh University", area: "Software Engineering", studyType: "M.Sc." }],
    });
    const before = structuredClone(input);
    expect(validateResume(input)).toEqual(before);
    expect(input).toEqual(before);
  });
});
