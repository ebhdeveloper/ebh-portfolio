import { applyResumeLocation, resumeLocationMaxLength } from "../model/location";
import { getResume } from "../../../lib/resume/load";
import { buildResumeDocument, isResumeProfile } from "../model/presentation";
import { generateResumePdf } from "./generate";

export async function getPdfResponse(profile: string, locale = "en", location = ""): Promise<Response> {
  if (!isResumeProfile(profile)) return Response.json({ error: "Unknown resume profile" }, { status: 404 });
  if (locale !== "en" && locale !== "fa") return Response.json({ error: "Unsupported resume language" }, { status: 400 });
  if (location.length > resumeLocationMaxLength) return Response.json({ error: "Resume location is too long" }, { status: 400 });
  const document = applyResumeLocation(buildResumeDocument(profile, getResume(profile), locale), location);
  const buffer = await generateResumePdf(document);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Language": locale,
      "Content-Disposition": `attachment; filename="${document.fileName}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
