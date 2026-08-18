import type { Dictionary } from "./types";
import { pt } from "./pt";
import { en } from "./en";

export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export const hreflangMap: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
