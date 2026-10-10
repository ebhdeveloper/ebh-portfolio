import { getTranslations } from "next-intl/server";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import type { ResumeBasics } from "@/lib/resume/types";

export async function ContactSection({ basics }: { basics: ResumeBasics }) {
  const t = await getTranslations("Portfolio");
  return (
    <>
      <section id="contact" className="pf-contact" aria-labelledby="contact-title">
        <p className="pf-eyebrow">03 / {t("contact")}</p>
        <h2 id="contact-title">{t("contactTitle")}</h2>
        <p className="pf-description">{t("contactDescription")}</p>
        <a className="pf-email" href={`mailto:${basics.email}`} dir="ltr">{basics.email}<ArrowIcon /></a>
      </section>
      <footer className="pf-footer">
        <span><bdi>{basics.name}</bdi> · {t("footer")}</span>
        <div className="pf-social" lang="en" dir="ltr">
          {basics.url && <a href={basics.url} target="_blank" rel="noopener noreferrer">GitHub<ArrowIcon /></a>}
          {basics.linkedin && <a href={basics.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<ArrowIcon /></a>}
        </div>
      </footer>
    </>
  );
}
