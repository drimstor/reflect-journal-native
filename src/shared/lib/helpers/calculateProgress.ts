import { ChecklistItem } from "@/src/entities/goals/model/types";

export const calculateProgress = (
  checklist?: ChecklistItem[] | null
): number => {
  if (!checklist || !Array.isArray(checklist) || checklist.length === 0) {
    return 0;
  }

  const completedItems = checklist.reduce((acc, item) => {
    return acc + (item.is_completed ? 1 : 0);
  }, 0);

  return Math.round((completedItems / checklist.length) * 100);
};
