import { useT } from "@/src/shared/lib/hooks";
import {
  isMonthYearValueEmpty,
  monthYearValueToTimestamp,
} from "@/src/shared/ui";
import { useCallback, useState } from "react";
import { ProfileFormConfig } from "./useProfileFormConfig";

/**
 * Хук для управления формой редактирования профиля
 * @param config - Конфигурация формы
 * @param onSubmit - Функция отправки формы
 * @returns Объект с методами управления формой
 */
export const useEditProfileForm = (
  config: ProfileFormConfig,
  onSubmit: (formData: FormData) => Promise<void>
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
      const value = values[field.key];

      if (field.required) {
        // Специальная проверка для MonthYearPicker
        if (field.type === "month-year-picker") {
          if (!value || isMonthYearValueEmpty(value)) {
            newErrors[field.key] = t("shared.validation.required");
            isValid = false;
          }
        }
        // Обычная проверка для остальных полей
        else if (!value) {
          newErrors[field.key] = t("shared.validation.required");
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [config.fields, values, t]);

  // Отправка формы
  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return;
    }

    try {
      // Создаем FormData для отправки данных
      const formData = new FormData();

      // Проходим по всем значениям и добавляем все поля
      Object.entries(values).forEach(([key, value]) => {
        // Специальная обработка для даты рождения (MonthYearValue)
        if (key === "birth_date") {
          if (value && !isMonthYearValueEmpty(value)) {
            const timestamp = monthYearValueToTimestamp(value);
            if (timestamp) {
              formData.append(key, timestamp.toString());
            }
          } else {
            // Если дата пустая, отправляем пустую строку
            formData.append(key, "");
          }
        }
        // Для остальных полей добавляем как есть (включая пустые строки)
        else {
          formData.append(key, value || "");
        }
      });

      console.log(
        "Отправляем FormData со всеми полями:",
        Object.fromEntries(formData.entries())
      );
      await onSubmit(formData);
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      // Можно добавить обработку ошибок от сервера
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
