import { getResume } from "../../../lib/resume/load";
import { buildResumeDocument, isResumeProfile } from "../model/presentation";
import { generateResumePdf } from "./generate";

export async function getPdfResponse(profile: string, locale = "en"): Promise<Response> {
  if (!isResumeProfile(profile)) return Response.json({ error: "Unknown resume profile" }, { status: 404 });
  if (locale !== "en" && locale !== "fa") return Response.json({ error: "Unsupported resume language" }, { status: 400 });
  const document = buildResumeDocument(profile, getResume(profile), locale);
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
