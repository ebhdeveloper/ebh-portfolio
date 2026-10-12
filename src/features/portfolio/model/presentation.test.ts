import { describe, expect, it } from "vitest";
import { makeProject, makeWork } from "../../../lib/resume/test-fixtures";
import { getProjectLinks, sortWorkByStartDate } from "./presentation";

describe("portfolio presentation", () => {
  it("orders the combined career history newest first without changing resume order", () => {
    const work = [
      makeWork({ id: "old", startDate: "2019" }),
      makeWork({ id: "new", startDate: "2025-06" }),
      makeWork({ id: "native", startDate: "2024-01" }),
      makeWork({ id: "later-month", startDate: "2024-09" }),
    ];
    expect(sortWorkByStartDate(work).map((job) => job.id)).toEqual(["new", "later-month", "native", "old"]);
    expect(work.map((job) => job.id)).toEqual(["old", "new", "native", "later-month"]);
  });

  it("preserves stable order for tied dates and supports no experience", () => {
    expect(sortWorkByStartDate([makeWork({ id: "a" }), makeWork({ id: "b" })]).map((job) => job.id)).toEqual(["a", "b"]);
    expect(sortWorkByStartDate([])).toEqual([]);
  });

  it("renders only the supported, validated link kinds", () => {
    const project = makeProject({ links: { website: "https://example.com", github: "https://github.com/example" } });
    Object.assign(project.links!, { surprise: "javascript:alert(1)" });
    expect(getProjectLinks(project)).toEqual([
      { kind: "website", url: "https://example.com" },
      { kind: "github", url: "https://github.com/example" },
    ]);
  });

  it("exposes Cafe Bazaar downloads as their own link kind", () => {
    const project = makeProject({ links: { cafeBazaar: "https://cafebazaar.ir/app/com.example" } });
    expect(getProjectLinks(project)).toEqual([{ kind: "cafeBazaar", url: "https://cafebazaar.ir/app/com.example" }]);
  });

  it("allows projects with no public links", () => {
    expect(getProjectLinks(makeProject())).toEqual([]);
    expect(getProjectLinks(makeProject({ links: {} }))).toEqual([]);
  });
});
