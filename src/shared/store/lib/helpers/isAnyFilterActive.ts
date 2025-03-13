import { FiltersState } from "../../zustand/filters.store";

/**
 * Проверяет, активен ли хотя бы один фильтр в состоянии фильтров
 * @param filters Состояние фильтров
 * @param excludePagination Исключить ли параметры пагинации из проверки (по умолчанию true)
 * @returns true, если хотя бы один фильтр активен, иначе false
 */
export const isAnyFilterActive = (
  filters: FiltersState,
  excludePagination: boolean = true
): boolean => {
  // Создаем копию объекта фильтров
  const filtersToCheck: Partial<FiltersState> = { ...filters };

  // Исключаем параметры пагинации, если нужно
  if (excludePagination) {
    delete filtersToCheck.page;
    delete filtersToCheck.limit;
  }

  // Проверяем каждое поле фильтра
  return Object.entries(filtersToCheck).some(([key, value]) => {
    // Исключаем функции
    if (typeof value === "function") return false;

    // Проверяем, что значение определено и не пустое
    if (value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;

    return true;
  });
};
