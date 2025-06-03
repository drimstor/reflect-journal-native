import { useState, useCallback, useEffect } from "react";
import { CreateFormConfig } from "./useCreateFormConfig";
import { useT } from "@/src/shared/lib/hooks";
import { Keyboard } from "react-native";
import { ENTITY_PLURAL } from "@/src/shared/const/ENTITIES";

/**
 * Хук для управления формой создания
 * @param config - Конфигурация формы
 * @param onSubmit - Функция отправки формы
 * @param entityType - Тип сущности
 * @param isBookmarked - Статус закладки
 * @param journalId - ID журнала (для записей)
 * @returns Объект с методами управления формой
 */
export const useCreateForm = (
  config: CreateFormConfig,
  onSubmit: (values: Record<string, any>) => Promise<void>,
  entityType: string,
  isBookmarked: boolean,
  journalId?: string | null
) => {
  const t = useT();
  // Состояние формы
  const [values, setValues] = useState<Record<string, any>>(
    config.initialValues || {}
  );

  // Обновляем values при изменении initialValues
  useEffect(() => {
    setValues(config.initialValues || {});
  }, [config.initialValues]);

  // Состояние ошибок
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Обработчик изменения поля
  const handleChange = useCallback(
    (key: string, value: any) => {
      setValues((prev) => ({
        ...prev,
        [key]: value,
      }));

      // Сбрасываем ошибку при изменении поля
      if (errors[key]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Валидация формы
  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Проверяем обязательные поля
    config.fields.forEach((field) => {
      if (field.required && !values[field.key]) {
        newErrors[field.key] = t("shared.validation.required");
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [config.fields, values, t]);

  // Отправка формы
  const handleSubmit = useCallback(async () => {
    if (validate()) {
      try {
        // Закрываем клавиатуру перед отправкой формы
        Keyboard.dismiss();
        // Добавляем статус закладки и journal_id перед отправкой
        const enhancedData = { ...values };

        // Добавляем bookmarked
        enhancedData.bookmarked = isBookmarked;

        // Для записей в журнале добавляем идентификатор журнала
        if (entityType === ENTITY_PLURAL.JOURNAL_ENTRY && journalId) {
          enhancedData.journal_id = journalId;
        }

        if (!enhancedData.related_topics?.length) {
          enhancedData.related_topics = ["New"];
        }

        await onSubmit(enhancedData);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  }, [onSubmit, validate, values, entityType, isBookmarked, journalId]);

  // Сброс формы
  const resetForm = useCallback(() => {
    setValues(config.initialValues || {});
    setErrors({});
  }, [config.initialValues]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
