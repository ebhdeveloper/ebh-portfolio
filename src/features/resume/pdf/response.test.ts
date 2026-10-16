import { describe, expect, it } from "vitest";
import { getPdfResponse } from "./response";
import { generateResumePdf } from "./generate";
import { buildResumeDocument } from "../model/presentation";
import { makeResume, makeWork } from "../../../lib/resume/test-fixtures";

describe("resume PDF download", () => {
  it("returns a real PDF attachment for each supported profile", async () => {
    for (const profile of ["react", "react-native", "fullstack"]) {
      const response = await getPdfResponse(profile);
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("application/pdf");
      expect(response.headers.get("Content-Disposition")).toBe(`attachment; filename="Ebrahim-Hamidi-${profile}-CV.pdf"`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
      expect(bytes.length).toBeGreaterThan(5000);
    }
  }, 30000);
  it("returns 404 for unknown profiles", async () => {
    for (const profile of ["native", "../react", "constructor"]) {
      const response = await getPdfResponse(profile);
      expect(response.status).toBe(404);
      expect(response.headers.get("Content-Type")).toContain("application/json");
    }
  });
});


describe("localized PDF downloads", () => {
  it("returns Persian PDFs for all profiles with separate filenames and language headers", async () => {
    for (const profile of ["react", "react-native", "fullstack"]) {
      const response = await getPdfResponse(profile, "fa");
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Language")).toBe("fa");
      expect(response.headers.get("Content-Disposition")).toBe(`attachment; filename="Ebrahim-Hamidi-${profile}-CV-fa.pdf"`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
      expect(bytes.length).toBeGreaterThan(5000);
    }
  }, 30000);
  it("rejects unsupported language parameters", async () => {
    expect((await getPdfResponse("react", "de")).status).toBe(400);
  });
});


describe("compact resume pagination", () => {
  it.each([
    ["react", "en"], ["react-native", "en"], ["react", "fa"], ["react-native", "fa"],
  ])("fits the current %s %s application resume on one page", async (profile, locale) => {
    const response = await getPdfResponse(profile, locale);
    const pdf = Buffer.from(await response.arrayBuffer()).toString("latin1");
    expect(pdf.match(/\/Type\s*\/Page(?=\s|\/|>)/g)?.length).toBe(1);
  }, 30000);

  it("continues onto another page when substantial new experience is added", async () => {
    const source = makeResume({ work: Array.from({ length: 12 }, (_, i) => makeWork({
      id: `job-${i}`, company: `Company ${i + 1}`,
      highlights: ["Built and maintained production mobile applications with native integrations and offline data storage. ".repeat(6)],
    })) });
    const bytes = await generateResumePdf(buildResumeDocument("react-native", source));
    const pdf = bytes.toString("latin1");
    expect((pdf.match(/\/Type\s*\/Page(?=\s|\/|>)/g) ?? []).length).toBeGreaterThan(1);
  }, 30000);
});
