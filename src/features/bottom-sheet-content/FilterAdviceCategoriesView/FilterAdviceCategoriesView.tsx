import { useT } from "@/src/shared/lib/hooks";
import { useAdviceCategoriesFilter } from "@/src/shared/lib/hooks/useAdviceCategoriesFilter";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetScrollView,
  Button,
  CheckIcon,
  List,
  PaddingLayout,
} from "@/src/shared/ui";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { styles } from "./FilterAdviceCategoriesView.styles";
import { ADVICE_CATEGORIES } from "./const/adviceCategories";

const FilterAdviceCategoriesView = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const { setBottomSheetVisible } = useBottomSheetStore();

  // Хук для управления исключенными категориями
  const {
    excludedCategories,
    isLoading: isFilterLoading,
    saveExcludedCategories,
    resetExcludedCategories,
  } = useAdviceCategoriesFilter();

  // Локальное состояние для выбранных категорий (для отмены изменений)
  const [localExcludedCategories, setLocalExcludedCategories] = useState<
    string[]
  >([]);

  // Инициализация локального состояния
  useEffect(() => {
    if (!isFilterLoading) {
      setLocalExcludedCategories(excludedCategories);
    }
  }, [excludedCategories, isFilterLoading]);

  // Функция получения переведенного названия категории
  const getCategoryName = (category: string): string => {
    const translationKey = `filter.adviceCategories.categories.${category}`;
    const translated = t(translationKey);

    // Если перевод не найден, возвращаем оригинальное название с заглавной буквы
    return translated === translationKey
      ? category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")
      : translated;
  };

  // Подготовка данных для списка
  const categoriesData = useMemo(() => {
    return ADVICE_CATEGORIES.map((category) => ({
      id: category,
      name: getCategoryName(category),
    }));
  }, [ADVICE_CATEGORIES, t]);

  // Обработчик сохранения
  const handleSave = async () => {
    try {
      await saveExcludedCategories(localExcludedCategories);
      setBottomSheetVisible(false);
    } catch (error) {
      console.error("Ошибка сохранения исключенных категорий:", error);
    }
  };

  // Обработчик сброса
  const handleReset = async () => {
    try {
      setLocalExcludedCategories([]);
      await resetExcludedCategories();
    } catch (error) {
      console.error("Ошибка сброса исключенных категорий:", error);
    }
  };

  // Обработчик изменения выбора категории
  const handleCategoryToggle = (categoryId: string) => {
    setLocalExcludedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  if (isFilterLoading) {
    return (
      <BottomSheetBox>
        <BottomSheetHeader title={t("filter.adviceCategories.title")} />
        <View style={styles.loadingContainer} />
      </BottomSheetBox>
    );
  }

  return (
    <BottomSheetBox>
      <BottomSheetHeader title={t("filter.adviceCategories.title")} />
      <BottomSheetScrollView>
        <PaddingLayout>
          <List
            listItemVariant="reverse"
            style={{ marginVertical: -10 }}
            items={categoriesData.map((category) => ({
              text: category.name,
              element: localExcludedCategories.includes(category.id) ? (
                <CheckIcon color={colors.contrast} size={20} />
              ) : undefined,
              IconComponent: () => null,
              onPress: () => handleCategoryToggle(category.id),
            }))}
          />
        </PaddingLayout>
        <BottomSheetFooter>
          <Button
            backgroundColor={colors.alternate}
            onPress={handleReset}
            disabled={localExcludedCategories.length === 0}
          >
            {t("shared.actions.reset")}
          </Button>
          <Button
            backgroundColor={theme === "dark" ? colors.accent : colors.primary}
            onPress={handleSave}
            isLoading={false}
          >
            {t("shared.actions.save")}
          </Button>
        </BottomSheetFooter>
      </BottomSheetScrollView>
    </BottomSheetBox>
  );
};

export default FilterAdviceCategoriesView;
