import type { FormFieldConfig } from "@/src/widgets/FormField/FormField";

// Константы для ролей
export const GROWTH_POINTS = [
  "personalGrowth",
  "career",
  "emotionalHealth",
  "relationships",
  "health",
  "financialLiteracy",
  "creativity",
  "education",
  "spirituality",
  "lifeStyle",
];

// Функции для создания переведенных опций
export const createGrowthPoints = (t: (key: string) => string, color: string) =>
  GROWTH_POINTS.map((point) => ({
    label: t(`settings.growthOptions.growthPoints.${point}`),
    value: point,
    tooltipText: t(`settings.growthOptions.tooltipTexts.${point}`),
    color,
  }));

// Функция для создания конфигурации полей формы с переводами
export const createGrowthFormFields = (
  t: (key: string) => string,
  color: string
): FormFieldConfig[] => [
  {
    key: "growth_points",
    type: "textarea",
    label: t("settings.growthForm.growthPoints.label"),
    placeholder: t("settings.growthForm.growthPoints.placeholder"),
    backgroundColor: color,
  },
  {
    key: "growth_points_chips",
    type: "chip-selector",
    label: t("settings.growthForm.growthChipsLabel"),
    multiple: true,
    chipOptions: createGrowthPoints(t, color),
    allowEmpty: true,
  },
];
