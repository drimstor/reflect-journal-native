import { LibraryListVariant } from "@/src/shared/model/types";
import { useState, useEffect } from "react";
import { useT } from "@/src/shared/lib/hooks/useLang";

/**
 * Тип поля формы редактирования
 */
export interface EditFormField {
  /** Ключ поля в объекте данных */
  key: string;
  /** Тип поля ввода */
  type: "text" | "textarea" | "toggle" | "tags" | "entities";
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
  variant: LibraryListVariant,
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
      case "Journals":
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

      case "JournalEntries":
        title = t("edit.journalEntries.title");
        fields = [
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
            key: "bookmarked",
            type: "toggle",
            label: t("edit.common.bookmarked.label"),
          },
        ];
        break;

      case "Chats":
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

      case "Goals":
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
            key: "bookmarked",
            type: "toggle",
            label: t("edit.common.bookmarked.label"),
          },
        ];
        break;

      case "Summaries":
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
