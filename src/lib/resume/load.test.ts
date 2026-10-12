import { describe, expect, it } from "vitest";
import { buildPortfolio, getResume } from "./load";
import { makeProject, makeResume, makeWork } from "./test-fixtures";
import type { ResumeSources } from "./types";

function sources(): ResumeSources {
  return {
    react: makeResume({
      work: [makeWork({ id: "shared", highlights: ["Web emphasis"] })],
      projects: [makeProject({ id: "shared-project", type: "web", title: "Web project" })],
    }),
    "react-native": makeResume({
      work: [makeWork({ id: "shared", highlights: ["Native emphasis"] }), makeWork({ id: "mobile-only" })],
      projects: [makeProject({ id: "shared-project", title: "Native project" }), makeProject({ id: "native-only" })],
    }),
    fullstack: makeResume(),
  };
}

describe("getResume", () => {
  it.each(["react", "react-native", "fullstack"])("selects exactly %s", (profile) => {
    const input = sources();
    expect(getResume(profile, input)).toEqual(input[profile as keyof ResumeSources]);
  });

  it.each(["vue", "React", "", "toString", "__proto__"])("rejects unknown profile %s", (profile) => {
    expect(() => getResume(profile, sources())).toThrow(/profile/i);
  });

  it("preserves profile-specific experience text", () => {
    expect(getResume("react-native", sources()).work[0].highlights).toEqual(["Native emphasis"]);
    expect(getResume("react", sources()).work[0].highlights).toEqual(["Web emphasis"]);
  });

  it("validates the selected source and leaves unrelated profiles independent", () => {
    const input = { ...sources(), fullstack: null };
    expect(getResume("react", input).work[0].id).toBe("shared");
    expect(() => getResume("fullstack", input)).toThrow(/resume/);
  });

  it("returns an empty fullstack profile without generating experience", () => {
    expect(getResume("fullstack", sources())).toEqual({
      basics: { name: "Ebrahim Hamidi", email: "ebh.developer@gmail.com" },
      work: [], projects: [], skills: [], education: [],
    });
  });
});

describe("buildPortfolio", () => {
  it("deduplicates by ID with React precedence and stable first-seen order", () => {
    const result = buildPortfolio(sources());
    expect(result.work.map((item) => item.id)).toEqual(["shared", "mobile-only"]);
    expect(result.work[0].highlights).toEqual(["Web emphasis"]);
    expect(result.projects.map((item) => item.id)).toEqual(["shared-project", "native-only"]);
    expect(result.projects[0].title).toBe("Web project");
  });

  it("prefers native over fullstack and includes fullstack-only records last", () => {
    const input = sources();
    input.fullstack = makeResume({
      work: [makeWork({ id: "mobile-only", highlights: ["Fullstack emphasis"] }), makeWork({ id: "fullstack-only" })],
      projects: [makeProject({ id: "native-only", title: "Fullstack title" }), makeProject({ id: "fullstack-project", type: "both" })],
    });
    const result = buildPortfolio(input);
    expect(result.work.map((item) => item.id)).toEqual(["shared", "mobile-only", "fullstack-only"]);
    expect(result.work[1].highlights).toEqual(["Built native calendar navigation."]);
    expect(result.projects.map((item) => item.id)).toEqual(["shared-project", "native-only", "fullstack-project"]);
    expect(result.projects[1].title).toBe("Calendar");
  });

  it("keeps distinct roles at the same company and independent work/project IDs", () => {
    const input = sources();
    input.react = makeResume({
      work: [makeWork({ id: "same" }), makeWork({ id: "another-role" })],
      projects: [makeProject({ id: "same" })],
    });
    expect(buildPortfolio(input).work.map((item) => item.id)).toEqual(["same", "another-role", "shared", "mobile-only"]);
    expect(buildPortfolio(input).projects.map((item) => item.id)).toEqual(["same", "shared-project", "native-only"]);
  });

  it.each(["react", "react-native", "fullstack"] as const)("validates %s even when records would be deduplicated", (profile) => {
    expect(() => buildPortfolio({ ...sources(), [profile]: null })).toThrow(/resume/);
  });

  it("does not mutate any supplied JSON or change order", () => {
    const input = sources();
    const before = structuredClone(input);
    getResume("react-native", input);
    buildPortfolio(input);
    expect(input).toEqual(before);
  });

  it("reflects newly appended experience in both CV and portfolio data", () => {
    const input = sources();
    input["react-native"] = makeResume({ work: [makeWork({ id: "new-work", company: "New company" })] });
    expect(getResume("react-native", input).work.map((item) => item.id)).toEqual(["new-work"]);
    expect(buildPortfolio(input).work.map((item) => item.id)).toEqual(["shared", "new-work"]);
  });

  it.each(["web", "mobile", "both"] as const)("reflects a new %s project in both consumers", (type) => {
    const input = sources();
    input.fullstack = makeResume({ projects: [makeProject({ id: "new-project", type })] });
    expect(getResume("fullstack", input).projects.map(({ id, type }) => ({ id, type }))).toEqual([{ id: "new-project", type }]);
    expect(buildPortfolio(input).projects.map(({ id, type }) => ({ id, type }))).toEqual([
      { id: "shared-project", type: "web" }, { id: "native-only", type: "mobile" }, { id: "new-project", type },
    ]);
  });
});

describe("actual resume JSON files", () => {
  it.each(["react", "react-native", "fullstack"])("loads and validates %s", (profile) => {
    const resume = getResume(profile);
    expect(resume.basics.name).toBe("Ebrahim Hamidi");
    expect(resume.basics.email).toBe("ebh.developer@gmail.com");
    [resume.work, resume.projects, resume.skills, resume.education].forEach((items) => expect(Array.isArray(items)).toBe(true));
  });

  it("contains the supplied real projects and preserves native metrics", () => {
    expect(getResume("react").projects.map(({ id }) => id)).toEqual(expect.arrayContaining(["beyondgrow", "youtopin", "simkhan", "wonderfruit"]));
    const native = getResume("react-native");
    expect(native.work.map(({ id }) => id)).toEqual(["namarang", "dp-lamp", "emzano", "taghvim", "behpardazan"]);
    expect(native.work.find(({ id }) => id === "taghvim")?.highlights).toContain("Optimized application performance by ~95%, eliminating lags and ensuring seamless user experience across devices.");
    expect(native.projects.map(({ id }) => id)).toEqual(expect.arrayContaining(["dp-lamp", "emzano", "taghvim"]));
    expect(getResume("fullstack").work).toEqual([]);
  });

  it("builds a single portfolio from real files", () => {
    expect(buildPortfolio().work.map(({ id }) => id)).toEqual(["namarang", "beyondgrow", "youtopin", "simkhan", "dp-lamp", "emzano", "taghvim", "behpardazan"]);
    const projects = buildPortfolio().projects;
    // New canonical JSON projects must be included without locking the collection size.
    for (const profile of ["react", "react-native", "fullstack"]) {
      expect(projects).toEqual(expect.arrayContaining(getResume(profile).projects));
    }
    expect(new Set(projects.map(({ id }) => id)).size).toBe(projects.length);
  });
});
