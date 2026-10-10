import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ResumePage } from "@/features/resume/components/resume-page";
import { isResumeProfile, resumeProfiles } from "@/features/resume/model/presentation";
import { getResume } from "@/lib/resume/load";
import "@/features/resume/styles.css";

export function generateStaticParams() {
  return resumeProfiles.map(({ id }) => ({ profile: id }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/resume/[profile]">): Promise<Metadata> {
  const { locale, profile } = await params;
  if (!hasLocale(routing.locales, locale) || !isResumeProfile(profile)) notFound();
  const t = await getTranslations({ locale, namespace: "Resume" });
  return { title: `${getResume(profile).basics.name} | ${t("title", { profile: resumeProfiles.find(entry => entry.id === profile)!.label })}` };
}

export default async function Page({ params }: PageProps<"/[locale]/resume/[profile]">) {
  const { profile } = await params;
  if (!isResumeProfile(profile)) notFound();
  return <ResumePage profile={profile} />;
}
