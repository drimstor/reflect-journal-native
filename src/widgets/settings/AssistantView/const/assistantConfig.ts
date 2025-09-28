import type { AssistantTemplate } from "@/src/entities/assistant/model/types";
import type { FormFieldConfig } from "@/src/widgets/FormField/FormField";

// Константы для ролей
export const ASSISTANT_ROLES = [
  "mentor",
  "coach",
  "friend",
  "therapist",
  "reflection_source",
];

// Константы для тона
export const ASSISTANT_TONES = [
  "friendly",
  "supportive",
  "professional",
  "strict",
  "humorous",
  "wise",
  "caring",
];

// Константы для стиля коммуникации
export const COMMUNICATION_STYLES = [
  "brief",
  "detailed",
  "empathetic",
  "direct",
  "analytical",
  "creative",
  "motivating",
  "insightful",
];

// Шаблоны (с ключами для переводов)
export const ASSISTANT_TEMPLATES_CONFIG = [
  {
    id: "life-coach",
    nameKey: "lifeCoach",
    role: "therapist",
    tone: ["supportive", "professional"],
    communication_style: ["detailed", "empathetic", "analytical"],
  },
  {
    id: "humorist",
    nameKey: "humorist",
    role: "friend",
    tone: ["friendly", "humorous"],
    communication_style: ["direct", "creative", "brief"],
  },
  {
    id: "major-payne",
    nameKey: "majorPayne",
    role: "coach",
    tone: ["strict"],
    communication_style: ["direct", "motivating", "brief"],
  },
  {
    id: "philosopher",
    nameKey: "philosopher",
    role: "reflection_source",
    tone: ["wise"],
    communication_style: ["creative", "insightful"],
  },
];

export const ASSISTANT_TOOLTIP_TEXTS = [
  "mentor",
  "coach",
  "reflection_source",
  "friendly",
  "professional",
];

// Функции для создания переведенных опций
export const createAssistantRoles = (
  t: (key: string) => string,
  color: string
) =>
  ASSISTANT_ROLES.map((role) => ({
    label: t(`settings.assistantOptions.roles.${role}`),
    value: role,
    tooltipText:
      ASSISTANT_TOOLTIP_TEXTS.includes(role) &&
      t(`settings.assistantOptions.tooltipTexts.${role}`),
    color,
  }));

export const createAssistantTones = (
  t: (key: string) => string,
  color: string
) =>
  ASSISTANT_TONES.map((tone) => ({
    label: t(`settings.assistantOptions.tones.${tone}`),
    value: tone,
    tooltipText:
      ASSISTANT_TOOLTIP_TEXTS.includes(tone) &&
      t(`settings.assistantOptions.tooltipTexts.${tone}`),
    color,
  }));

export const createCommunicationStyles = (
  t: (key: string) => string,
  color: string
) =>
  COMMUNICATION_STYLES.map((style) => ({
    label: t(`settings.assistantOptions.styles.${style}`),
    value: style,
    color,
  }));

export const createAssistantTemplates = (
  t: (key: string) => string
): AssistantTemplate[] =>
  ASSISTANT_TEMPLATES_CONFIG.map((template) => ({
    id: template.id,
    name: t(`settings.assistantTemplates.${template.nameKey}.name`),
    role: template.role,
    tone: template.tone,
    communication_style: template.communication_style,
  }));

// Функция для создания конфигурации полей формы с переводами
export const createAssistantFormFields = (
  t: (key: string) => string,
  color: string
): FormFieldConfig[] => [
  {
    key: "role",
    type: "chip-selector",
    label: t("settings.assistantForm.role.label"),
    multiple: false,
    chipOptions: createAssistantRoles(t, color),
    allowEmpty: true,
  },
  {
    key: "tone",
    type: "chip-selector",
    label: t("settings.assistantForm.tone.label"),
    multiple: true,
    chipOptions: createAssistantTones(t, color),
  },
  {
    key: "communication_style",
    type: "chip-selector",
    label: t("settings.assistantForm.communicationStyle.label"),
    multiple: true,
    chipOptions: createCommunicationStyles(t, color),
  },
  {
    key: "additional_info",
    type: "textarea",
    label: t("settings.assistantForm.additionalInfo.label"),
    placeholder: t("settings.assistantForm.additionalInfo.placeholder"),
    backgroundColor: color,
  },
];
