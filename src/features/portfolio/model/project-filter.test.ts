import { describe, expect, it } from "vitest";
import { makeProject } from "../../../lib/resume/test-fixtures";
import { createProjectFilterStore, filterProjects } from "./project-filter";

const projects = [
  makeProject({ id: "web", type: "web" }),
  makeProject({ id: "mobile", type: "mobile" }),
  makeProject({ id: "shared", type: "both" }),
];

describe("project filtering", () => {
  it.each([
    ["all", ["web", "mobile", "shared"]],
    ["web", ["web", "shared"]],
    ["mobile", ["mobile", "shared"]],
  ] as const)("includes the right projects for %s", (filter, expected) => {
    expect(filterProjects(projects, filter).map((project) => project.id)).toEqual(expected);
  });

  it("includes a newly supplied JSON project without changing the original list", () => {
    const added = makeProject({ id: "new-mobile", type: "mobile" });
    expect(filterProjects([...projects, added], "mobile").map((project) => project.id))
      .toEqual(["mobile", "shared", "new-mobile"]);
    expect(projects.map((project) => project.id)).toEqual(["web", "mobile", "shared"]);
  });

  it("returns an empty result when the chosen platform has no projects", () => {
    expect(filterProjects([projects[0]], "mobile")).toEqual([]);
    expect(filterProjects([], "all")).toEqual([]);
  });

  it("updates one filter store without leaking into another instance", () => {
    const first = createProjectFilterStore();
    const second = createProjectFilterStore();
    first.getState().setFilter("mobile");
    expect(first.getState().filter).toBe("mobile");
    expect(second.getState().filter).toBe("all");
    first.getState().setFilter("all");
    expect(first.getState().filter).toBe("all");
  });
});
