import { describe, expect, it } from "vitest";
import { getPdfResponse } from "./response";

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
