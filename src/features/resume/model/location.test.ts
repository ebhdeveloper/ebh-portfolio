import { describe, expect, it } from "vitest";
import { getResume } from "../../../lib/resume/load";
import { buildResumeDocument } from "./presentation";
import { applyResumeLocation, normalizeResumeLocation } from "./location";

describe("custom resume location", () => {
  it("changes only the displayed location and leaves canonical data intact", () => {
    const source = getResume("react");
    const before = structuredClone(source);
    const original = buildResumeDocument("react", source);
    const updated = applyResumeLocation(original, "  Tehran, Iran  ");
    expect(updated.location).toBe("Tehran, Iran");
    expect(updated.locationLocale).toBe("en");
    expect(updated.basics).toEqual(original.basics);
    expect(original.location).not.toBe("Tehran, Iran");
    expect(source).toEqual(before);
  });
  it("uses the appropriate font for Persian locations on English resumes and vice versa", () => {
    expect(applyResumeLocation(buildResumeDocument("react", getResume("react")), "تهران، ایران").locationLocale).toBe("fa");
    expect(applyResumeLocation(buildResumeDocument("react", getResume("react"), "fa"), "Tehran, Iran").locationLocale).toBe("en");
  });
  it("restores the original location for blank input", () => {
    const cv = buildResumeDocument("react", getResume("react"));
    expect(applyResumeLocation(cv, " \n ").location).toBe(cv.location);
  });
  it("normalizes pasted whitespace and limits text for PDF layout", () => {
    expect(normalizeResumeLocation("Tehran\n\t Iran")).toBe("Tehran Iran");
    expect(normalizeResumeLocation("a".repeat(121))).toHaveLength(120);
  });
});
