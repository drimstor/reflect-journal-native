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
  if (!currentCache) {
    return newItems;
  }

  // Проверяем, есть ли фильтры (кроме пагинации)
  const urlParams = new URLSearchParams(params || "");
  const hasOnlyPagination = Array.from(urlParams.keys()).every(
    (key) => key === "page" || key === "limit"
  );

  // Если есть фильтры (кроме пагинации), возвращаем только новые данные
  if (!hasOnlyPagination) {
    return newItems;
  }

  // Получаем текущую страницу
  const currentPage = parseInt(urlParams.get("page") || "1", 10);

  // Проверяем, был ли удален элемент
  // Если это первая страница (или страница не указана) и общее количество элементов уменьшилось
  if (
    (currentPage === 1 || !urlParams.has("page")) &&
    newItems.totalItems < currentCache.totalItems
  ) {
    // Получаем ID элементов из нового ответа
    const newItemIds = new Set(newItems.data.map((item) => item.id));

    // Фильтруем текущий кеш, оставляя только те элементы, которые есть в новом ответе
    const updatedData = currentCache.data.filter((item) =>
      newItemIds.has(item.id)
    );

    // Создаем карту новых элементов для быстрого доступа
    const newItemsMap = new Map(newItems.data.map((item) => [item.id, item]));

    // Обновляем существующие элементы и добавляем новые
    const mergedData = updatedData.map((item) =>
      newItemsMap.has(item.id) ? newItemsMap.get(item.id)! : item
    );

    // Добавляем новые элементы, которых нет в кеше
    const existingIds = new Set(mergedData.map((item) => item.id));
    const uniqueNewItems = newItems.data.filter(
      (item) => !existingIds.has(item.id)
    );

    return {
      ...newItems,
      data: [...mergedData, ...uniqueNewItems],
    };
  }

  // Создаем карту новых элементов для быстрого доступа
  const newItemsMap = new Map(newItems.data.map((item) => [item.id, item]));

  // Обновляем существующие элементы в кеше
  const updatedCache = currentCache.data.map((item) =>
    newItemsMap.has(item.id) ? newItemsMap.get(item.id)! : item
  );

  // Находим новые элементы, которых нет в кеше
  const existingIds = new Set(updatedCache.map((item) => item.id));
  const uniqueNewItems = newItems.data.filter(
    (item) => !existingIds.has(item.id)
  );

  return {
    ...newItems,
    data: [...updatedCache, ...uniqueNewItems],
  };
}

export interface PaginatedData<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  [key: string]: any; // Для дополнительных полей
}
