import { Locale } from "@/src/shared/i18n/types";
import { useI18nStore } from "@/src/shared/store";
import { useCallback } from "react";

// Конфигурация доступных языков
export const LANGUAGES_CONFIG = [
  {
    code: "ru" as Locale,
    name: "Русский",
    nativeName: "Русский",
  },
  {
    code: "en" as Locale,
    name: "English",
    nativeName: "English",
  },
] as const;

export const useLang = () => {
  const { locale, setLocale } = useI18nStore();

  const toggleLanguage = useCallback(() => {
    setLocale(locale === "ru" ? "en" : "ru");
  }, [locale, setLocale]);

  // Получить конфиг текущего языка
  const getCurrentLanguage = useCallback(() => {
    return (
      LANGUAGES_CONFIG.find((lang) => lang.code === locale) ||
      LANGUAGES_CONFIG[0]
    );
  }, [locale]);

  return {
    locale,
    setLocale,
    toggleLanguage,
    languages: LANGUAGES_CONFIG,
    getCurrentLanguage,
  };
};

export const useT = () => {
  const { t } = useI18nStore();
  return t;
};
