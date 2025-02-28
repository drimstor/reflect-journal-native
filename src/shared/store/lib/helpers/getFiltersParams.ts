import { FiltersState } from "@/src/shared/store";

export const getFiltersParams = (filters: FiltersState): string => {
  const params = new URLSearchParams();

  // Добавляем базовые параметры
  params.append("page", filters.page.toString());
  params.append("limit", filters.limit.toString());

  // Добавляем поисковый запрос если есть
  if (filters.search) {
    params.append("search", filters.search);
  }

  // Добавляем параметры сортировки
  if (filters.sort_field) {
    params.append("sort_field", filters.sort_field);
  }
  if (filters.sort_order) {
    params.append("sort_order", filters.sort_order);
  }

  // Добавляем временные диапазоны если они установлены
  if (filters.created_at_from) {
    params.append("created_at_from", filters.created_at_from);
  }
  if (filters.created_at_to) {
    params.append("created_at_to", filters.created_at_to);
  }
  if (filters.updated_at_from) {
    params.append("updated_at_from", filters.updated_at_from);
  }
  if (filters.updated_at_to) {
    params.append("updated_at_to", filters.updated_at_to);
  }

  // Добавляем дополнительные фильтры
  if (filters.ai_response !== undefined) {
    params.append("ai_response", filters.ai_response.toString());
  }
  if (filters.related_topics) {
    params.append("related_topics", filters.related_topics);
  }
  if (filters.bookmarked !== undefined) {
    params.append("bookmarked", filters.bookmarked.toString());
  }

  return params.toString();
};
