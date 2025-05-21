"use client";
import { useTranslations } from "@/lib/dictionary/useTranslations";

export const Locale = () => {
  const translte = useTranslations();
  return <p className="mt-6 text-sm">{translte("thankyou_message")}</p>;
};
