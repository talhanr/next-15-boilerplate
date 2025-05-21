import "server-only";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((mod) => mod.default),
  de: () => import("@/dictionaries/de.json").then((mod) => mod.default),
};

export const getDictionary = async (locale: keyof typeof dictionaries) =>
  dictionaries[locale]?.() ?? dictionaries.en();

export async function generateStaticParams() {
  return ["en", "fr", "de"].map((locale) => ({ locale }));
}
