// Константы категорий советов из affirmations.yaml
export const ADVICE_CATEGORIES = [
  "sleep",
  "nutrition",
  "communication",
  "relationships",
  "work_and_hobby",
  "sports",
  "rest",
  "mental_health",
  "finance",
] as const;

export type AdviceCategory = (typeof ADVICE_CATEGORIES)[number];
