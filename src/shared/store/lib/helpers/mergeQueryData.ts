/**
 * Универсальная функция для объединения данных в RTK Query при обновлении кэша
 * Обрабатывает случаи с пагинацией и удалением элементов
 * Заменяет элементы с совпадающими ID для обновления вложенных данных
 *
 * @template T - Тип элементов в массиве данных (должен содержать поле id)
 * @param {PaginatedData<T> | undefined} currentCache - Текущий кеш
 * @param {PaginatedData<T>} newItems - Новые данные
 * @param {string} [params] - Параметры запроса (строка query параметров)
 * @returns {PaginatedData<T>} Объединенные данные с обновленными элементами
 */
export function mergeQueryData<T extends { id: string }>(
  currentCache: PaginatedData<T> | undefined,
  newItems: PaginatedData<T>,
  params?: string
): PaginatedData<T> {
  // Если кеша нет, просто возвращаем новые данные
  if (!currentCache) return newItems;

  // Проверяем, есть ли фильтры (кроме пагинации)
  const urlParams = new URLSearchParams(params || "");
  const currentPage = parseInt(urlParams.get("page") || "1", 10);
  const isFiltered = !Array.from(urlParams.keys()).every(
    (key) => key === "page" || key === "limit"
  );

  // Если есть фильтры (кроме пагинации)
  if (isFiltered) {
    // Возвращаем только новые данные при наличии фильтров
    return newItems;
    // Обработка данных без фильтров (только пагинация)
  } else {
    // Если это первая страница, возвращаем данные с бекенда как есть
    if (currentPage === 1 || !urlParams.has("page")) return newItems;

    // Создаем Map для хранения уникальных элементов, где ключ - id элемента
    const uniqueItems = new Map<string, T>();

    // Добавляем существующие элементы из кеша в Map
    currentCache.data.forEach((item) => uniqueItems.set(item.id, item));

    // Добавляем или обновляем элементы из новых данных
    newItems.data.forEach((item) => uniqueItems.set(item.id, item));

    // Возвращаем обновленный объект с объединенными данными
    return {
      ...newItems,
      data: Array.from(uniqueItems.values()),
    };
  }
}

export interface PaginatedData<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  [key: string]: any; // Для дополнительных полей
}
