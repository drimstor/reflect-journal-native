import { useI18nStore } from "@/src/shared/store";
import { useCallback } from "react";

export const useLang = () => {
  const { locale, setLocale } = useI18nStore();

  const toggleLanguage = useCallback(() => {
    setLocale(locale === "ru" ? "en" : "ru");
  }, [locale, setLocale]);

  return { locale, setLocale, toggleLanguage };
};

export const useT = () => {
  const { t } = useI18nStore();
  return t;
};
