export interface ChecklistItem {
  id: string;
  title: string;
  is_completed: boolean;
  completed_at: string | null;
}

export interface Entity {
  id: string;
  entity_type: string;
  name: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  checklist: ChecklistItem[];
  created_at: string;
  updated_at: string | null;
  related_entities: Entity[] | null;
  related_topics: string[] | null;
  is_completed: boolean;
  bookmarked: boolean;
}

export interface GoalResponse {
  data: Goal[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface CreateGoalRequest {
  message_id: string;
}

export interface UpdateGoalRequest {
  name?: string;
  bookmarked?: boolean;
  related_topics?: string[];
  checklist?: ChecklistItem[];
}

export interface AddChecklistItemRequest {
  title: string;
}

export interface UpdateChecklistItemRequest {
  is_completed: boolean;
}

export interface BulkUpdateChecklistItemsRequest {
  items: {
    id: string;
    is_completed: boolean;
  }[];
}

export interface PredictGoalRequest {
  source_type: string;
  source_id: string;
}

/**
 * Запрос на генерацию цели без сохранения в БД
 */
export interface GenerateGoalRequest {
  /** Название цели */
  name: string;
  /** Дополнительная информация для генерации задач */
  additional_info?: string;
  /** Список связанных тем */
  related_topics?: string[];
}

/**
 * Запрос на сохранение сгенерированной цели в БД
 */
export interface SaveGoalRequest {
  /** Название цели */
  name: string;
  /** Список элементов чек-листа */
  checklist: {
    title: string;
  }[];
  /** Список связанных тем */
  related_topics?: string[];
  /** Добавить цель в закладки */
  bookmarked?: boolean;
}
