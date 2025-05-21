'use client'

import { ReactNode, createContext } from "react";
import { Dictionary } from "../types/dictionary";

interface TranslationProviderProps {
  dict: Dictionary;
  children: ReactNode;
}

export const TranslationContext = createContext<Dictionary | null>(
  null
);

export function TranslationProvider({
  dict,
  children,
}: TranslationProviderProps) {
  return (
    <TranslationContext.Provider value={dict}>
      {children}
    </TranslationContext.Provider>
  );
}
