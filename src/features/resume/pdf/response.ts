import { getResume } from "../../../lib/resume/load";
import { buildResumeDocument, isResumeProfile } from "../model/presentation";
import { generateResumePdf } from "./generate";

export async function getPdfResponse(profile: string): Promise<Response> {
  if (!isResumeProfile(profile)) return Response.json({ error: "Unknown resume profile" }, { status: 404 });
  const document = buildResumeDocument(profile, getResume(profile));
  const buffer = await generateResumePdf(document);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${document.fileName}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
