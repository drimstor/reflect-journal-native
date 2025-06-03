import { EntityType } from "@/src/shared/model/types";
import { useState, useEffect } from "react";
import { useT } from "@/src/shared/lib/hooks/useLang";
import { FormField } from "@/src/widgets";

/**
 * Конфигурация формы редактирования
 */
export interface EditFormConfig {
  /** Заголовок формы */
  title: string;
  /** Поля формы */
  fields: FormField[];
  /** Начальные значения полей */
  initialValues: Record<string, any>;
}

/**
 * Хук для получения конфигурации формы редактирования в зависимости от типа сущности
 * @param entityType - Данные сущности для редактирования
 * @returns Конфигурация формы редактирования
 */
export const useEditFormConfig = (entityType?: string): EditFormConfig => {
  const t = useT();
  const [config, setConfig] = useState<EditFormConfig>({
    title: t("edit.title"),
    fields: [],
    initialValues: {},
  });

  useEffect(() => {
    // Конфигурация полей в зависимости от типа сущности

    const title = t("edit.goals.title");
    const fields: FormField[] =
      entityType === "customRequest"
        ? [
            {
              key: "customAdditionalInfo",
              type: "textarea",
              label: t("create.customAdditionalInfo.label"),
              placeholder: t("create.customAdditionalInfo.placeholder"),
              superMultiline: true,
              required: true,
            },
          ]
        : [
            {
              key: "additionalInfo",
              type: "textarea",
              label: t("create.additionalInfo.label"),
              placeholder: t("create.additionalInfo.placeholder"),
            },
          ];

    // Базовые начальные значения
    const initialValues: Record<string, any> = {};

    // Заполняем начальные значения только для полей, которые будут редактироваться
    if (entityType) {
      fields.forEach((field) => {
        if (
          entityType &&
          typeof entityType === "object" &&
          field.key in entityType
        ) {
          initialValues[field.key] = (entityType as any)[field.key];
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
  }, [entityType, t]);

  return config;
};
