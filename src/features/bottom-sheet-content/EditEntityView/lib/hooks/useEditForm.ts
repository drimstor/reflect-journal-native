import { useState, useCallback } from "react";
import { EditFormConfig } from "./useEditFormConfig";
import { useT } from "@/src/shared/lib/hooks";

/**
 * Хук для управления формой редактирования
 * @param config - Конфигурация формы
 * @param onSubmit - Функция отправки формы
 * @returns Объект с методами управления формой
 */

export const useEditForm = (
  config: EditFormConfig,
  onSubmit: (values: Record<string, any>) => Promise<void>
) => {
  const t = useT();
  // Состояние формы
  const [values, setValues] = useState<Record<string, any>>(
    config.initialValues || {}
  );

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
  }, [config.fields, values]);

  // Отправка формы
  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return;
    }

    try {
      // Находим измененные значения
      const changedValues = Object.entries(values).reduce<Record<string, any>>(
        (acc, [key, value]) => {
          if (value !== config.initialValues[key]) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      // Отправляем только измененные значения
      await onSubmit(changedValues);
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      // Можно добавить обработку ошибок от сервера
    } finally {
    }
  }, [values, config.initialValues, validate, onSubmit]);

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
