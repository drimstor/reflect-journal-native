import { useState, useEffect } from "react";
import { useT } from "@/src/shared/lib/hooks/useLang";
import { ENTITY_PLURAL } from "@/src/shared/const/ENTITIES";
import { FormField } from "@/src/widgets";

/**
 * Конфигурация формы создания
 */
export interface CreateFormConfig {
  /** Заголовок формы */
  title: string;
  /** Поля формы */
  fields: FormField[];
  /** Начальные значения полей */
  initialValues: Record<string, any>;
}

/**
 * Хук для получения конфигурации формы создания
 * @param entityType - Тип сущности
 * @returns Конфигурация формы создания
 */
export const useCreateFormConfig = (entityType: string) => {
  const t = useT();
  const [config, setConfig] = useState<CreateFormConfig>({
    title: "",
    fields: [],
    initialValues: {},
  });

  useEffect(() => {
    let title = "";
    let fields: FormField[] = [];

    // Конфигурация полей в зависимости от типа сущности
    switch (entityType) {
      case ENTITY_PLURAL.JOURNAL:
        title = t("entities.journals.singular");
        fields = [
          {
            key: "name",
            type: "text",
            label: t("edit.journals.name.label"),
            placeholder: t("edit.journals.name.placeholder"),
            required: true,
          },
          {
            key: "description",
            type: "textarea",
            label: t("edit.journals.description.label"),
            placeholder: t("edit.journals.description.placeholder"),
          },
          {
            key: "related_topics",
            type: "tags",
            label: t("edit.common.relatedTopics.label"),
            placeholder: t("edit.common.relatedTopics.placeholder"),
          },
          {
            key: "ai_response",
            type: "toggle",
            label: t("edit.common.aiResponse.label"),
          },
        ];
        break;

      case ENTITY_PLURAL.JOURNAL_ENTRY:
        title = t("entities.journalentriesfull.singular");
        fields = [
          {
            key: "mood",
            type: "mood",
            label: t("edit.common.mood.label"),
            required: false,
          },
          {
            key: "title",
            type: "text",
            label: t("edit.journalEntries.titleField.label"),
            placeholder: t("edit.journalEntries.titleField.placeholder"),
            required: false,
          },
          {
            key: "content",
            type: "textarea",
            label: t("edit.journalEntries.content.label"),
            placeholder: t("addEntry.startWriting"),
            required: true,
            superMultiline: true,
          },
        ];
        break;
      case ENTITY_PLURAL.CHAT:
        title = t("entities.chats.singular");
        fields = [
          {
            key: "name",
            type: "text",
            label: t("edit.chats.name.label"),
            placeholder: t("edit.chats.name.placeholder"),
            required: true,
          },
          {
            key: "description",
            type: "textarea",
            label: t("edit.chats.description.label"),
            placeholder: t("edit.chats.description.placeholder"),
          },
          {
            key: "related_topics",
            type: "tags",
            label: t("edit.common.relatedTopics.label"),
            placeholder: t("edit.common.relatedTopics.placeholder"),
          },
        ];
        break;

      default:
        break;
    }

    // Базовые начальные значения
    const initialValues: Record<string, any> = {};

    // Устанавливаем значения по умолчанию
    fields.forEach((field) => {
      switch (field.type) {
        case "text":
        case "textarea":
          initialValues[field.key] = "";
          break;
        case "toggle":
          initialValues[field.key] = true;
          break;
        case "tags":
        case "entities":
          initialValues[field.key] = [];
          break;
        case "mood":
          initialValues[field.key] = "neutral";
          break;
      }
    });

    setConfig({
      title,
      fields,
      initialValues,
    });
  }, [entityType, t]);

  return config;
};
