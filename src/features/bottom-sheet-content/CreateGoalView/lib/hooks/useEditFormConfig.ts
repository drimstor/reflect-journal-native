import { Goal } from "@/src/entities/goals/model/types";
import { useT } from "@/src/shared/lib/hooks/useLang";
import { useEffect, useState } from "react";

/**
 * Тип поля формы редактирования
 */
export interface EditFormField {
  /** Ключ поля в объекте данных */
  key: string;
  /** Тип поля ввода */
  type: "text" | "textarea" | "tags" | "check-list";
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
 * @param entityData - Данные сущности для редактирования
 * @returns Конфигурация формы редактирования
 */
export const useEditFormConfig = (entityData?: Goal): EditFormConfig => {
  const t = useT();
  const [config, setConfig] = useState<EditFormConfig>({
    title: t("edit.title"),
    fields: [],
    initialValues: {},
  });

  useEffect(() => {
    // Конфигурация полей в зависимости от типа сущности

    const title = t("edit.goals.title");
    const fields: EditFormField[] = [
      {
        key: "name",
        type: "text",
        label: t("edit.goals.name.label"),
        placeholder: t("edit.goals.name.placeholder"),
        required: true,
      },
      {
        key: "additional_info",
        type: "textarea",
        label: t("edit.goals.additionalInfo.label"),
        placeholder: t("edit.goals.additionalInfo.placeholder"),
      },
      {
        key: "description",
        type: "text",
        label: t("edit.goals.description.label"),
        placeholder: t("edit.goals.description.placeholder"),
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
    ];

    // Базовые начальные значения
    const initialValues: Record<string, any> = {};

    // Заполняем начальные значения только для полей, которые будут редактироваться
    if (entityData) {
      fields.forEach((field) => {
        if (
          entityData &&
          typeof entityData === "object" &&
          field.key in entityData
        ) {
          initialValues[field.key] = (entityData as any)[field.key];
        } else {
          // Устанавливаем значения по умолчанию для отсутствующих полей
          switch (field.type) {
            case "text":
            case "textarea":
              initialValues[field.key] = "";
              break;
            case "tags":
              initialValues[field.key] = [];
              break;
            case "check-list":
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
  }, [entityData, t]);

  return config;
};
