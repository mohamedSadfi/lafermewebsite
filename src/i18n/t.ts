/**
 * Minimal type-safe translation helper.
 *
 * Currently French-only — `astro.config.mjs` declares `defaultLocale: "fr"`.
 * To add a language later:
 *   1. Drop a sibling JSON file (e.g. en.json) with the same shape.
 *   2. Add the locale to the `locales` array in astro.config.mjs.
 *   3. Switch dictionary lookup based on Astro.currentLocale (or
 *      route prefix) in this file.
 *
 * Components import the `t()` function and call e.g. `t("nav.histoire")`.
 */
import fr from "./fr.json";

type Dict = typeof fr;

// Recursively flattened dot-keys: "nav.histoire", "form.submit", ...
type DotPaths<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? DotPaths<T[K], `${P}${K}.`>
    : `${P}${K}`;
}[keyof T & string];

export type TranslationKey = DotPaths<Dict>;

const dictionaries: Record<string, Dict> = { fr };

export function t(key: TranslationKey, locale: string = "fr"): string {
  const dict = dictionaries[locale] ?? dictionaries.fr;
  const segments = key.split(".");
  let cursor: unknown = dict;
  for (const seg of segments) {
    if (cursor && typeof cursor === "object" && seg in cursor) {
      cursor = (cursor as Record<string, unknown>)[seg];
    } else {
      return key; // fall back to the key itself when unknown
    }
  }
  return typeof cursor === "string" ? cursor : key;
}
