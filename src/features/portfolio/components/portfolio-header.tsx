import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export async function PortfolioHeader() {
  const t = await getTranslations("Portfolio");
  const locale = await getLocale();
  return (
    <>
      <a className="pf-skip" href="#main">{t("skip")}</a>
      <header className="pf-header">
        <a className="pf-wordmark" href="#main" aria-label="Ebrahim Hamidi" lang="en" dir="ltr">ebh<span>.</span></a>
        <nav className="pf-nav" aria-label={t("navigation")}>
          <a href="#work">{t("work")}</a>
          <a href="#experience">{t("experience")}</a>
          <a href="#contact">{t("contact")}</a>
        </nav>
        <div className="pf-toolbar">
          <a className="ui-button pf-header-contact" href="#contact">{t("contact")}</a>
          <a href={getPathname({ href: "/", locale: locale === "fa" ? "en" : "fa" })} lang={locale === "fa" ? "en" : "fa"} aria-label={t("languageLabel")} className="pf-language">
            {t("language")}
          </a>
          <ThemeToggle label={t("themeToggle")} />
        </div>
      </header>
    </>
  );
}
