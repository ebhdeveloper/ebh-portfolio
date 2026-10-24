import { connection } from "next/server";
import { getPdfResponse } from "@/features/resume/pdf/response";

export async function GET(request: Request, { params }: RouteContext<"/api/resume/[profile]">) {
  // Generate from this deployment's JSON on demand, outside the prerender pass.
  await connection();
  const { profile } = await params;
  const query = new URL(request.url).searchParams;
  return getPdfResponse(profile, query.get("locale") ?? "en", query.get("location") ?? "");
}
