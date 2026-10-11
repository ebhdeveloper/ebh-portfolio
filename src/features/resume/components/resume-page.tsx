import { LanguageSwitch } from "@/components/ui/language-switch";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { getResume } from "@/lib/resume/load";
import type { ResumeProfile } from "@/lib/resume/types";
import { buildResumeDocument, resumeProfiles } from "../model/presentation";
import { ResumeDocument } from "./resume-document";
import { ResumeMenu } from "./resume-menu";
import { PrintButton } from "./print-button";

export async function ResumePage({ profile }: { profile: ResumeProfile }) {
  const currentLocale = await getLocale();
  const locale = hasLocale(routing.locales, currentLocale) ? currentLocale : routing.defaultLocale;
  const otherLocale = locale === "fa" ? "en" : "fa";
  const t = await getTranslations("Resume");
  const cv = buildResumeDocument(profile, getResume(profile), locale);
  return <main className="cv-page">
    <div className="cv-toolbar">
      <a className="cv-back" href={getPathname({ href: "/", locale })}>{t("back")}</a>
      <div className="cv-actions">
        <LanguageSwitch href={getPathname({ href: `/resume/${profile}`, locale: otherLocale })} label={t("switchLanguage")} code={otherLocale === "fa" ? "FA" : "EN"} />
        <ResumeMenu label={t("choose")} links={resumeProfiles.map(entry => ({ profile: entry.id, href: getPathname({ href: `/resume/${entry.id}`, locale }) }))} />
        <a className="ui-button" href={`/api/resume/${profile}?locale=${locale}`} download={cv.fileName}>{t("download")}</a>
        <PrintButton label={t("print")} pendingLabel={t("preparing")} />
      </div>
    </div>
    <div className="cv-intro"><p className="cv-kicker">{t("kicker")}</p><h2>{t("title", { profile: cv.profileLabel })}</h2><p>{t("description")}</p></div>
    {cv.isIncomplete && <p className="cv-notice" role="note">{t("incomplete")}</p>}
    <ResumeDocument document={cv} />
    <p className="cv-print-hint">{t("printHint")}</p>
  </main>;
}
