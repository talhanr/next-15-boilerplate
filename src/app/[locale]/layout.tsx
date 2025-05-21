// /app/[locale]/layout.tsx
import { ReactNode } from "react";
import { getDictionary, Locale } from "@/lib/dictionary/dictionary";
import { TranslationProvider } from "@/lib/dictionary/context/translation-context";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<LocaleLayoutProps>) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <TranslationProvider dict={dict}>{children}</TranslationProvider>;
}
