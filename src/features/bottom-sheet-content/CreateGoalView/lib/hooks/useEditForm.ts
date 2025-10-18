import { useT } from "@/src/shared/lib/hooks";
import { useCallback, useState } from "react";
import { EditFormConfig } from "./useEditFormConfig";

/**
 * Хук для управления формой редактирования
 * @param config - Конфигурация формы
 * @param onSubmit - Функция отправки формы
 * @param onSecondarySubmit - Функция вторичной отправки (для второй кнопки)
 * @returns Объект с методами управления формой
 */

export const useEditForm = (
  config: EditFormConfig,
  onSubmit: (values: Record<string, any>) => Promise<void>,
  onSecondarySubmit?: (values: Record<string, any>) => Promise<void>
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
      // Отправляем только измененные значения
      await onSubmit(values);
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      // Можно добавить обработку ошибок от сервера
    } finally {
    }
  }, [values, config.initialValues, validate, onSubmit]);

  // Обработчик вторичной отправки
  const handleSecondarySubmit = useCallback(async () => {
    if (!onSecondarySubmit) return;

    if (!validate()) {
      return;
    }

    try {
      // Для вторичной отправки передаем все значения формы
      await onSecondarySubmit(values);
    } catch (error) {
      console.error("Ошибка при вторичной отправке формы:", error);
    }
  }, [values, validate, onSecondarySubmit]);

  // Сброс формы
  const resetForm = useCallback(() => {
    setValues(config.initialValues || {});
    setErrors({});
  }, [config.initialValues]);

  // Обновление нескольких значений формы (только непустые)
  const updateValues = useCallback((newValues: Record<string, any>) => {
    setValues((prev) => {
      const updated = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const value = newValues[key];
        // Обновляем только если значение не пустое
        if (value !== undefined && value !== null && value !== "") {
          // Для массивов проверяем длину
          if (Array.isArray(value)) {
            if (value.length > 0) {
              updated[key] = value;
            }
          } else {
            updated[key] = value;
          }
        }
      });
      return updated;
    });
  }, []);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    handleSecondarySubmit,
    resetForm,
    updateValues,
  };
};
