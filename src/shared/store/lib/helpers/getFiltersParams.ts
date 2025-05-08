import { FiltersState, isAnyFilterActive } from "@/src/shared/store";

export const getFiltersParams = (
  filters: FiltersState & { journal_id?: string; min_count?: number },
  baseParams: boolean = true
): string => {
  const params = new URLSearchParams();

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
  if (filters.is_completed !== undefined) {
    params.append("is_completed", filters.is_completed.toString());
  }
  if (filters.ai_response !== undefined) {
    params.append("ai_response", filters.ai_response.toString());
  }
  if (filters.related_topics) {
    params.append("related_topics", filters.related_topics);
  }

  if (filters.bookmarked !== undefined) {
    params.append("bookmarked", filters.bookmarked.toString());
  }

  // Добавляем journal_id если он установлен
  if (filters.journal_id) {
    params.append("journal_id", filters.journal_id);
  }

  if (filters.category) {
    params.append("category", filters.category);
  }

  if (filters.min_count) {
    params.append("min_count", filters.min_count.toString());
  }

  if (!baseParams) return params.toString();

  const isFilterActive = isAnyFilterActive(filters);

  // Добавляем базовые параметры
  params.append("page", filters.page?.toString() || "1");
  params.append("limit", isFilterActive ? "50" : filters.limit.toString());

  return params.toString();
};
