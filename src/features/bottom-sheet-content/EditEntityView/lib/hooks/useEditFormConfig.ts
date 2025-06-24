import { useT } from "@/src/shared/lib/hooks/useLang";
import { EntityType } from "@/src/shared/model/types";
import { useEffect, useState } from "react";
import { ENTITY_NAME } from "../../../../../shared/const/ENTITIES";

/**
 * Тип поля формы редактирования
 */
export interface EditFormField {
  /** Ключ поля в объекте данных */
  key: string;
  /** Тип поля ввода */
  type:
    | "text"
    | "textarea"
    | "toggle"
    | "tags"
    | "entities"
    | "mood"
    | "check-list";
  /** Заголовок поля */
  label: string;
  /** Подсказка для поля */
  placeholder?: string;
  /** Является ли поле обязательным */
  required?: boolean;
}

/**
 * Конфигурация формы редактирования
 */
export interface EditFormConfig {
  /** Заголовок формы */
  title: string;
  /** Поля формы */
  fields: EditFormField[];
  /** Начальные значения полей */
  initialValues: Record<string, any>;
}

/**
 * Хук для получения конфигурации формы редактирования в зависимости от типа сущности
 * @param variant - Тип сущности
 * @param entityData - Данные сущности для редактирования
 * @returns Конфигурация формы редактирования
 */
export const useEditFormConfig = (
  variant: EntityType,
  entityData?: Record<string, any>
): EditFormConfig => {
  const t = useT();
  const [config, setConfig] = useState<EditFormConfig>({
    title: t("edit.title"),
    fields: [],
    initialValues: {},
  });

  useEffect(() => {
    // Конфигурация полей в зависимости от типа сущности
    let fields: EditFormField[] = [];
    let title = "";

    switch (variant) {
      case ENTITY_NAME.JOURNALS:
        title = t("edit.journals.title");
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
          {
            key: "bookmarked",
            type: "toggle",
            label: t("edit.common.bookmarked.label"),
          },
        ];
        break;

      case ENTITY_NAME.JOURNAL_ENTRIES:
        title = t("edit.journalEntries.title");
        fields = [
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
            placeholder: t("edit.journalEntries.content.placeholder"),
          },
          {
            key: "related_topics",
            type: "tags",
            label: t("edit.common.relatedTopics.label"),
            placeholder: t("edit.common.relatedTopics.placeholder"),
          },
          {
            key: "mood",
            type: "mood",
            label: t("edit.common.mood.label"),
            required: false,
          },
          {
            key: "bookmarked",
            type: "toggle",
            label: t("edit.common.bookmarked.label"),
          },
        ];
        break;

      case ENTITY_NAME.CHATS:
        title = t("edit.chats.title");
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
          {
            key: "bookmarked",
            type: "toggle",
            label: t("edit.common.bookmarked.label"),
          },
        ];
        break;

      case ENTITY_NAME.GOALS:
        title = t("edit.goals.title");
        fields = [
          {
            key: "name",
            type: "text",
            label: t("edit.goals.name.label"),
            placeholder: t("edit.goals.name.placeholder"),
            required: true,
          },
          {
            key: "related_topics",
            type: "tags",
            label: t("edit.common.relatedTopics.label"),
            placeholder: t("edit.common.relatedTopics.placeholder"),
          },
          {
            key: "checklist",
            type: "check-list",
            label: t("edit.goals.tasks.label"),
          },
          {
            key: "bookmarked",
            type: "toggle",
            label: t("edit.common.bookmarked.label"),
          },
        ];
        break;

      case ENTITY_NAME.SUMMARIES:
        title = t("edit.summaries.title");
        fields = [
          {
            key: "name",
            type: "text",
            label: t("edit.summaries.name.label"),
            placeholder: t("edit.summaries.name.placeholder"),
            required: true,
          },
          {
            key: "related_topics",
            type: "tags",
            label: t("edit.common.relatedTopics.label"),
            placeholder: t("edit.common.relatedTopics.placeholder"),
          },
          {
            key: "bookmarked",
            type: "toggle",
            label: t("edit.common.bookmarked.label"),
          },
        ];
        break;

      case ENTITY_NAME.TEST_RESULTS:
        title = t("edit.testResults.title");
        fields = [
          {
            key: "related_topics",
            type: "tags",
            label: t("edit.common.relatedTopics.label"),
            placeholder: t("edit.common.relatedTopics.placeholder"),
          },
          {
            key: "bookmarked",
            type: "toggle",
            label: t("edit.common.bookmarked.label"),
          },
        ];
        break;

      default:
        break;
    }

    // Базовые начальные значения
    const initialValues: Record<string, any> = {};

    // Заполняем начальные значения только для полей, которые будут редактироваться
    if (entityData) {
      fields.forEach((field) => {
        if (field.key in entityData) {
          initialValues[field.key] = entityData[field.key];
        } else {
          // Устанавливаем значения по умолчанию для отсутствующих полей
          switch (field.type) {
            case "text":
            case "textarea":
              initialValues[field.key] = "";
              break;
            case "toggle":
              initialValues[field.key] = false;
              break;
            case "tags":
            case "entities":
              initialValues[field.key] = [];
              break;
          }
        }
      });
    }

    setConfig({
      title,
      fields,
      initialValues,
    });
  }, [variant, entityData, t]);

  return config;
};
