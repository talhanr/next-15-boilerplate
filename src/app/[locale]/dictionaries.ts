import { Dictionary } from "@/lib/dictionary/types/dictionary";
import "server-only";

export type Locale = keyof typeof dictionaries;

const dictionaries = {
  en: () =>
    import("@/dictionaries/en.json").then((mod) => mod.default as Dictionary),
  de: () =>
    import("@/dictionaries/de.json").then((mod) => mod.default as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  ((await dictionaries[locale]?.()) ?? dictionaries.en()) as Dictionary;

export async function generateStaticParams() {
  return ["en", "de"].map((locale) => ({ locale }));
}
