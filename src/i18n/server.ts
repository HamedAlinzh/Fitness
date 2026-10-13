import "server-only";
import { lang as rootLang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

/**
 * The current language, readable from any Server Component without passing `lang`
 * down through every layer (it is the `[lang]` root param). Cannot be used in Client
 * Components, Server Actions or Route Handlers — those receive the language as a prop or
 * a form field instead.
 */
export async function getLocale(): Promise<Locale> {
  const value = await rootLang();
  if (!isLocale(value)) notFound();
  return value;
}

export async function getDict() {
  return getDictionary(await getLocale());
}
