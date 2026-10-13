import type { Locale } from "../config";
import { fa, type Dictionary } from "./fa";
import { en } from "./en";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { fa, en };

/**
 * Synchronous on purpose: the dictionaries are plain objects, which lets Client
 * Components (navbar, consultation form) call it too. Both are a few KB.
 */
export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}
