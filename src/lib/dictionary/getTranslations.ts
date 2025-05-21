import { getDictionary, Locale } from "./dictionary";

export async function getTranslations(locale: Locale) {
  const dict = await getDictionary(locale);
  return <K extends keyof typeof dict>(key: K) => dict[key] ?? key;
}
