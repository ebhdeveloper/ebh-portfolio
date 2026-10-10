import { getFormatter, getTranslations } from "next-intl/server";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import type { ResumeBasics } from "@/lib/resume/types";
import { HeroArtwork } from "./hero-artwork";

export async function HeroSection({ basics, projectCount }: { basics: ResumeBasics; projectCount: number }) {
  const t = await getTranslations("Portfolio");
  const format = await getFormatter();
  return (
    <section className="pf-hero" aria-labelledby="hero-title">
      <div className="pf-hero-copy">
        <p className="pf-eyebrow"><span className="pf-dot" /><bdi>{basics.name}</bdi><span>·</span>{t("kicker")}</p>
        <h1 id="hero-title" className="pf-hero-title">
          <span>{t("heroFirst")}</span>
          <span className="pf-title-middle">{t("heroMiddle")}</span>
          <span className="pf-title-accent">{t("heroLast")}</span>
        </h1>
        <p className="pf-description">{t("heroDescription")}</p>
        <div className="pf-actions">
          <a className="ui-button" href="#work">{t("viewWork")}<ArrowIcon /></a>
          <a className="pf-text-link" href={`mailto:${basics.email}`}>{t("getInTouch")}<ArrowIcon /></a>
        </div>
      </div>
      <HeroArtwork web={t("webLabel")} mobile={t("mobileLabel")} caption={t("visualCaption")} />
      <div className="pf-hero-foot">
        <span>{t("specialty")}</span>
        <span className="pf-stack" lang="en" dir="ltr">React / React Native / TypeScript</span>
        <span>{t("projectCount", { count: format.number(projectCount) })}</span>
      </div>
    </section>
  );
}
