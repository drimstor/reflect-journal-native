import { useT } from "@/src/shared/lib/hooks";
import { addSnackbar, useAppDispatch, useThemeStore } from "@/src/shared/store";
import {
  AnimatedAppearance,
  Button,
  Loader,
  Select,
  Separator,
} from "@/src/shared/ui";
import { FormField } from "@/src/widgets";
import { useCallback, useImperativeHandle, useMemo } from "react";
import { View } from "react-native";
import {
  createAssistantFormFields,
  createAssistantTemplates,
} from "./const/assistantConfig";
import { useAssistantForm } from "./lib/hooks/useAssistantForm";

interface AssistantViewProps {
  chipColor?: string;
  onExternalSubmit?: React.MutableRefObject<(() => Promise<boolean>) | null>;
}

const AssistantView = ({ chipColor, onExternalSubmit }: AssistantViewProps) => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const dispatch = useAppDispatch();

  // Мемоизируем создание шаблонов и полей формы
  const assistantTemplates = useMemo(() => createAssistantTemplates(t), [t]);
  const assistantFormFields = useMemo(
    () => createAssistantFormFields(t, chipColor),
    [t, chipColor]
  );

  // Мемоизируем опции для Select
  const templateOptions = useMemo(
    () =>
      assistantTemplates.map((template) => ({
        label: template.name,
        value: template.id,
      })),
    [assistantTemplates]
  );

  // Используем хук для работы с формой ассистента
  const {
    values,
    selectedTemplate,
    isLoading,
    isSaving,
    handleChange,
    handleSubmit,
    applyTemplate,
    clearAllFields,
  } = useAssistantForm();

  // Обработчик применения шаблона
  const handleTemplateSelect = (templateValue: string) => {
    if (!templateValue) {
      // Пользователь выбрал пустое значение (плейсхолдер) - очищаем все поля
      clearAllFields();
      return;
    }

    const template = assistantTemplates.find((t) => t.id === templateValue);
    if (template) {
      applyTemplate(template, templateValue);
    }
  };

  // Обработчик сохранения с подтверждением
  const handleSaveWithConfirmation = useCallback(async (): Promise<boolean> => {
    try {
      await handleSubmit();
      if (onExternalSubmit) return true;
      dispatch(
        addSnackbar({
          text: t("settings.saveSuccess"),
          type: "success",
        })
      );
    } catch {
      dispatch(
        addSnackbar({
          text: t("settings.saveError"),
          type: "error",
        })
      );
      return false;
    }
  }, [handleSubmit, dispatch, t]);

  // Передаем функцию submit наружу через ref с помощью useImperativeHandle
  useImperativeHandle(onExternalSubmit, () => handleSaveWithConfirmation, [
    handleSaveWithConfirmation,
  ]);

  if (isLoading) {
    return (
      <AnimatedAppearance isInitialVisible>
        <Loader style={{ paddingTop: onExternalSubmit ? 50 : 100 }} />
      </AnimatedAppearance>
    );
  }

  return (
    <>
      {/* Выбор шаблона */}
      <Select
        label={t("settings.assistantTemplate.title")}
        placeholder={t("settings.assistantTemplate.placeholder")}
        options={templateOptions}
        value={selectedTemplate}
        onValueChange={handleTemplateSelect}
        backgroundColor={chipColor || colors.lightGray}
      />

      <Separator />

      {/* Основные поля формы */}
      {assistantFormFields.map((field) => (
        <FormField
          key={field.key}
          field={field}
          value={values[field.key as keyof typeof values]}
          onChange={handleChange}
        />
      ))}

      {!onExternalSubmit && (
        <View style={{ marginTop: 10 }}>
          <Button
            backgroundColor={theme === "dark" ? colors.accent : colors.primary}
            textColor={theme === "dark" ? colors.primary : colors.white}
            onPress={handleSaveWithConfirmation}
            isLoading={isSaving}
            disabled={isSaving}
          >
            {t("shared.actions.save")}
          </Button>
        </View>
      )}
    </>
  );
};

export default AssistantView;
