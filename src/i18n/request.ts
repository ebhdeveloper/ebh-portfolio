import * as rootParams from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";
import type messages from "../messages/en.json";

const dictionaries = {
  en: () => import("../messages/en.json").then((module) => module.default),
  fa: () => import("../messages/fa.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<typeof messages>>;

export default getRequestConfig(async ({ locale }) => {
  const requested = locale ?? await rootParams.locale();
  if (!hasLocale(routing.locales, requested)) notFound();

  return {
    locale: requested,
    messages: await dictionaries[requested](),
  };
});
