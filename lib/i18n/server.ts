import { cookies } from "next/headers";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  es: () => import("@/dictionaries/es.json").then((module) => module.default),
  fr: () => import("@/dictionaries/fr.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  
  if (localeCookie && Object.keys(dictionaries).includes(localeCookie)) {
    return localeCookie as Locale;
  }
  
  // Default locale
  return "es";
}

export async function getDictionary(locale: Locale) {
  // Add a fallback just in case
  const loadDictionary = dictionaries[locale] || dictionaries.es;
  return loadDictionary();
}
