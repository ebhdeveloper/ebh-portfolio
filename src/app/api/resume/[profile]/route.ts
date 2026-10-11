import { connection } from "next/server";
import { getPdfResponse } from "@/features/resume/pdf/response";

export async function GET(request: Request, { params }: RouteContext<"/api/resume/[profile]">) {
  // Generate from this deployment's JSON on demand, outside the prerender pass.
  await connection();
  const { profile } = await params;
  return getPdfResponse(profile, new URL(request.url).searchParams.get("locale") ?? "en");
}
