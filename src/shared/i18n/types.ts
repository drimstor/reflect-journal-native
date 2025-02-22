export type Locale = "ru" | "en";

export interface Translations {
  [key: string]: string | Translations;
}

export interface I18nState {
  locale: Locale;
  translations: Record<string, string>;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string; // translator function
}
