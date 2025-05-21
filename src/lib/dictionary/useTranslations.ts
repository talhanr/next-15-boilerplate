"use client";

import { useContext, useMemo } from "react";
import { TranslationContext } from "./context/translation-context";
import { Dictionary } from "./types/dictionary";

export function useTranslations() {
  const dict = useContext(TranslationContext);
  if (!dict)
    throw new Error(
      "useTranslations must be used within a TranslationProvider"
    );

  return <K extends keyof Dictionary>(key: K) => dict[key];
}
