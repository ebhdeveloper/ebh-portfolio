import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/arrow-icon";

export default async function NotFoundPage() {
  const locale = await getLocale();
  const t = await getTranslations("NotFound");

  return (
    <main className="ui-not-found">
      <span className="ui-not-found-code" aria-hidden="true" dir="ltr">404</span>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <a className="ui-button" href={getPathname({ href: "/", locale })}>
        {t("return")}<ArrowIcon />
      </a>
    </main>
  );
}
