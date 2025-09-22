import {
  useCreateAssistantStrategyMutation,
  useGetAssistantStrategyQuery,
  useUpdateAssistantStrategyMutation,
} from "@/src/entities/assistant/api/rtkApi";
import type { AssistantStrategy } from "@/src/entities/assistant/model/types";
import { useT } from "@/src/shared/lib/hooks";
import { useCallback, useEffect, useState } from "react";
import { createAssistantTemplates } from "../../const/assistantConfig";

interface UseAssistantFormReturn {
  values: Partial<AssistantStrategy>;
  selectedTemplate: string;
  isLoading: boolean;
  isSaving: boolean;
  errors: Record<string, string>;
  handleChange: (key: string, value: any) => void;
  handleSubmit: () => Promise<void>;
  applyTemplate: (
    template: {
      role: string;
      tone: string[];
      communication_style: string[];
      additional_info?: string;
    },
    templateId: string
  ) => void;
  clearSelectedTemplate: () => void;
  clearAllFields: () => void;
}

export const useAssistantForm = (): UseAssistantFormReturn => {
  const t = useT();

  const [values, setValues] = useState<Partial<AssistantStrategy>>({
    role: "",
    tone: [],
    communication_style: [],
    additional_info: "",
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isApplyingTemplate, setIsApplyingTemplate] = useState<boolean>(false);

  // Функция для определения соответствующего шаблона по текущим значениям
  const findMatchingTemplate = useCallback(
    (currentValues: Partial<AssistantStrategy>): string => {
      if (
        !currentValues.role ||
        !currentValues.tone ||
        !currentValues.communication_style
      ) {
        return "";
      }

      const templates = createAssistantTemplates(t);
      const matchingTemplate = templates.find((template) => {
        // Проверяем совпадение роли
        if (template.role !== currentValues.role) return false;

        // Проверяем совпадение тона (все элементы должны совпадать)
        const toneMatches =
          template.tone.length === currentValues.tone!.length &&
          template.tone.every((tone) => currentValues.tone!.includes(tone));

        if (!toneMatches) return false;

        // Проверяем совпадение стиля коммуникации (все элементы должны совпадать)
        const styleMatches =
          template.communication_style.length ===
            currentValues.communication_style!.length &&
          template.communication_style.every((style) =>
            currentValues.communication_style!.includes(style)
          );

        return styleMatches;
      });

      return matchingTemplate ? matchingTemplate.id : "";
    },
    [t]
  );

  // Запросы к API
  const { data: strategy, isLoading } = useGetAssistantStrategyQuery();
  const [createStrategy, { isLoading: isCreating }] =
    useCreateAssistantStrategyMutation();
  const [updateStrategy, { isLoading: isUpdating }] =
    useUpdateAssistantStrategyMutation();

  const isSaving = isCreating || isUpdating;

  // Загружаем данные при получении ответа от сервера
  useEffect(() => {
    if (strategy) {
      const newValues = {
        role: strategy.role || "",
        tone: strategy.tone || [],
        communication_style: strategy.communication_style || [],
        additional_info: strategy.additional_info || "",
      };
      setValues(newValues);

      // Определяем соответствующий шаблон для загруженных данных
      const matchingTemplateId = findMatchingTemplate(newValues);
      setSelectedTemplate(matchingTemplateId);
    }
  }, [strategy, findMatchingTemplate]);

  // Автоматически определяем соответствующий шаблон при изменении значений
  useEffect(() => {
    // Пропускаем автоматическое определение, если сейчас применяется шаблон
    if (isApplyingTemplate) {
      setIsApplyingTemplate(false);
      return;
    }

    const matchingTemplateId = findMatchingTemplate(values);
    setSelectedTemplate(matchingTemplateId);
  }, [values, findMatchingTemplate, isApplyingTemplate]);

  // Обработчик изменения полей
  const handleChange = useCallback(
    (key: string, value: any) => {
      setValues((prev) => ({
        ...prev,
        [key]: value,
      }));

      // Очищаем ошибку для этого поля
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

  // Применение шаблона
  const applyTemplate = useCallback(
    (
      template: {
        role: string;
        tone: string[];
        communication_style: string[];
        additional_info?: string;
      },
      templateId: string
    ) => {
      setIsApplyingTemplate(true);
      setSelectedTemplate(templateId);
      setValues({
        role: template.role,
        tone: template.tone,
        communication_style: template.communication_style,
        additional_info: template.additional_info || "",
      });
      setErrors({});
    },
    []
  );

  // Валидация формы
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Проверяем, есть ли хотя бы одно заполненное поле
    const hasRole = values.role && values.role !== "";
    const hasTone = values.tone && values.tone.length > 0;
    const hasStyle =
      values.communication_style && values.communication_style.length > 0;
    const hasAnyField = hasRole || hasTone || hasStyle;

    // Если есть хотя бы одно заполненное поле, то все основные поля должны быть заполнены
    if (hasAnyField) {
      if (!values.role) {
        newErrors.role = t("shared.validation.required");
      }

      if (!values.tone || values.tone.length === 0) {
        newErrors.tone = t("shared.validation.required");
      }

      if (
        !values.communication_style ||
        values.communication_style.length === 0
      ) {
        newErrors.communication_style = t("shared.validation.required");
      }
    }
    // Если все поля пустые - это валидно (можно сохранить пустые настройки)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values.role, values.tone, values.communication_style, t]);

  // Обработчик отправки формы
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        role: values.role,
        tone: values.tone || [],
        communication_style: values.communication_style || [],
        additional_info: values.additional_info || "",
      };

      if (strategy) {
        // Обновляем существующую стратегию
        await updateStrategy(submitData).unwrap();
      } else {
        // Создаем новую стратегию
        await createStrategy(submitData).unwrap();
      }
    } catch (error) {
      console.error("Ошибка при сохранении настроек ассистента:", error);
      setErrors({ general: t("settings.assistantForm.saveError") });
    }
  }, [values, strategy, createStrategy, updateStrategy, t, validateForm]);

  // Функция для принудительной очистки выбранного шаблона
  const clearSelectedTemplate = useCallback(() => {
    setSelectedTemplate("");
  }, []);

  // Функция для очистки всех полей
  const clearAllFields = useCallback(() => {
    setIsApplyingTemplate(true);
    setSelectedTemplate("");
    setValues({
      role: "",
      tone: [],
      communication_style: [],
      additional_info: "",
    });
    setErrors({});
  }, []);

  return {
    values,
    selectedTemplate,
    isLoading,
    isSaving,
    errors,
    handleChange,
    handleSubmit,
    applyTemplate,
    clearSelectedTemplate,
    clearAllFields,
  };
};
