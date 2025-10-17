import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { flattenTranslations } from "../../i18n/lib/flattenTranslations";
import en from "../../i18n/locales/en.json";
import ru from "../../i18n/locales/ru.json";
import { I18nState, Locale, Translations } from "../../i18n/types";

const translations: Record<Locale, Translations> = { ru, en };

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: "ru",
      translations: flattenTranslations(translations.ru),
      setLocale: (locale: Locale) =>
        set({
          locale,
          translations: flattenTranslations(translations[locale]),
        }),
      t: (key: string) => {
        const translation = get().translations[key];
        if (!translation) {
          console.warn(`Translation key not found: ${key}`);
          return "";
        }
        return translation;
      },
    }),
    {
      name: "translations-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
