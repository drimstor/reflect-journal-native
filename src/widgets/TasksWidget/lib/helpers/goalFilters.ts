// Типы для структуры данных целей
export interface ChecklistItem {
  id: string;
  title: string;
  is_completed: boolean;
  completed_at: string | null;
}

export interface RelatedEntity {
  name: string;
  entity_type: string;
  id: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  checklist: ChecklistItem[];
  created_at: string;
  updated_at: string;
  related_entities: RelatedEntity[];
  related_topics: string[];
  is_completed: boolean;
  bookmarked: boolean;
}

// Возможные статусы целей
export type GoalStatus = "toDo" | "inProgress" | "complete";

/**
 * Определяет статус цели на основе её состояния и состояния чеклиста
 * @param goal - объект цели
 * @returns статус цели
 */
export const getGoalStatus = (goal: Goal): GoalStatus => {
  // Если цель завершена, статус "complete"
  if (goal.is_completed) {
    return "complete";
  }

  // Если цель не завершена, проверяем чеклист
  const allChecklistItemsIncomplete = goal.checklist.every(
    (item) => !item.is_completed
  );

  // Если все элементы чеклиста не завершены, статус "to_do"
  if (allChecklistItemsIncomplete) {
    return "toDo";
  }

  // Если есть завершенные элементы чеклиста, но цель не завершена, статус "in_progress"
  return "inProgress";
};

/**
 * Фильтрует массив целей по заданному статусу
 * @param goals - массив целей
 * @param status - статус для фильтрации
 * @returns отфильтрованный массив целей
 */
export const filterGoalsByStatus = (
  goals: Goal[],
  status: GoalStatus
): Goal[] => {
  return goals.filter((goal) => getGoalStatus(goal) === status);
};

/**
 * Получает количество целей для каждого статуса
 * @param goals - массив целей
 * @returns объект с количеством целей по статусам
 */
export const getGoalStatusCounts = (goals: Goal[]) => {
  const counts = {
    toDo: 0,
    inProgress: 0,
    complete: 0,
  };

  goals.forEach((goal) => {
    const status = getGoalStatus(goal);
    counts[status]++;
  });

  return counts;
};
