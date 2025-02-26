import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nState, Locale, Translations } from "../../i18n/types";
import ru from "../../i18n/locales/ru.json";
import en from "../../i18n/locales/en.json";
import { flattenTranslations } from "../../i18n/lib/flattenTranslations";

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
          return key;
        }
        return translation;
      },
    }),
    {
      name: "i18n-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
