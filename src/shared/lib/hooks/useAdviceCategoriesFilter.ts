import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { SimpleEventEmitter } from "../utils/SimpleEventEmitter";

const EXCLUDED_CATEGORIES_KEY = "excluded_advice_categories";

// Создаем глобальный EventEmitter для уведомления об изменениях
const categoriesEmitter = new SimpleEventEmitter();
const CATEGORIES_CHANGED_EVENT = "categories_changed";

export const useAdviceCategoriesFilter = () => {
  const [excludedCategories, setExcludedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка исключенных категорий при инициализации
  const loadExcludedCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(EXCLUDED_CATEGORIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setExcludedCategories(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Ошибка загрузки исключенных категорий:", error);
      setExcludedCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Сохранение исключенных категорий
  const saveExcludedCategories = useCallback(async (categories: string[]) => {
    try {
      await AsyncStorage.setItem(
        EXCLUDED_CATEGORIES_KEY,
        JSON.stringify(categories)
      );
      setExcludedCategories(categories);

      // Уведомляем все экземпляры хука об изменении
      categoriesEmitter.emit(CATEGORIES_CHANGED_EVENT, categories);
    } catch (error) {
      console.error("Ошибка сохранения исключенных категорий:", error);
    }
  }, []);

  // Добавление категории в исключения
  const addExcludedCategory = useCallback(
    async (category: string) => {
      const newExcluded = [...excludedCategories];
      if (!newExcluded.includes(category)) {
        newExcluded.push(category);
        await saveExcludedCategories(newExcluded);
      }
    },
    [excludedCategories, saveExcludedCategories]
  );

  // Удаление категории из исключений
  const removeExcludedCategory = useCallback(
    async (category: string) => {
      const newExcluded = excludedCategories.filter((cat) => cat !== category);
      await saveExcludedCategories(newExcluded);
    },
    [excludedCategories, saveExcludedCategories]
  );

  // Переключение состояния категории
  const toggleCategory = useCallback(
    async (category: string) => {
      if (excludedCategories.includes(category)) {
        await removeExcludedCategory(category);
      } else {
        await addExcludedCategory(category);
      }
    },
    [excludedCategories, addExcludedCategory, removeExcludedCategory]
  );

  // Сброс всех исключений
  const resetExcludedCategories = useCallback(async () => {
    await saveExcludedCategories([]);
  }, [saveExcludedCategories]);

  // Проверка, исключена ли категория
  const isCategoryExcluded = useCallback(
    (category: string) => {
      return excludedCategories.includes(category);
    },
    [excludedCategories]
  );

  // Инициализация при монтировании
  useEffect(() => {
    loadExcludedCategories();
  }, [loadExcludedCategories]);

  // Слушатель изменений из других экземпляров хука
  useEffect(() => {
    const handleCategoriesChanged = (newCategories: string[]) => {
      setExcludedCategories(newCategories);
    };

    categoriesEmitter.on(CATEGORIES_CHANGED_EVENT, handleCategoriesChanged);

    return () => {
      categoriesEmitter.off(CATEGORIES_CHANGED_EVENT, handleCategoriesChanged);
    };
  }, []);

  return {
    excludedCategories,
    isLoading,
    addExcludedCategory,
    removeExcludedCategory,
    toggleCategory,
    resetExcludedCategories,
    saveExcludedCategories,
    isCategoryExcluded,
    loadExcludedCategories,
  };
};
