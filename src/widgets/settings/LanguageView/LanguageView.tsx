import { useLang, useT } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import { CheckIcon, MenuList } from "@/src/shared/ui";
import { memo, useMemo } from "react";

const LanguageView = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { locale, setLocale, languages } = useLang();

  // Создаем список языков для выбора
  const languageMenuItems = useMemo(
    () =>
      languages.map((language) => {
        const handleLanguageSelect = () => setLocale(language.code);
        const isSelected = locale === language.code;

        return {
          text: language.name,
          onPress: handleLanguageSelect,
          element: isSelected ? (
            <CheckIcon size={20} color={colors.accent} />
          ) : undefined,
        };
      }),
    [languages, locale, setLocale, colors.accent]
  );

  return <MenuList title={t("settings.language")} items={languageMenuItems} />;
};

export default memo(LanguageView);
