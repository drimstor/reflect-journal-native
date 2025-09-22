import { useT } from "@/src/shared/lib/hooks";
import {
  addSnackbar,
  useAppDispatch,
  useDeviceStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  Button,
  Layout,
  Loader,
  PaddingLayout,
  Select,
  Separator,
  Text,
} from "@/src/shared/ui";
import { FormField, Header } from "@/src/widgets";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import {
  createAssistantFormFields,
  createAssistantTemplates,
} from "./const/assistantConfig";
import { useAssistantForm } from "./lib/hooks/useAssistantForm";
import { styles } from "./SettingsAssistantScreen.styles";

const SettingsAssistantScreen = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const dispatch = useAppDispatch();
  const { window } = useDeviceStore();

  // Мемоизируем создание шаблонов и полей формы
  const assistantTemplates = useMemo(() => createAssistantTemplates(t), [t]);
  const assistantFormFields = useMemo(() => createAssistantFormFields(t), [t]);

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
    errors,
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
  const handleSaveWithConfirmation = async () => {
    try {
      await handleSubmit();
      dispatch(
        addSnackbar({
          text: t("settings.assistantForm.saveSuccess"),
          type: "success",
        })
      );
    } catch {
      dispatch(
        addSnackbar({
          text: t("settings.assistantForm.saveError"),
          type: "error",
        })
      );
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Header
          backButton
          title={t("settings.assistantSettings")}
          subtitle={t("settings.title")}
        />
        <View style={styles.loadingContainer}>
          <Loader size={window.width - 100} />
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header
        backButton
        title={t("settings.assistantSettings")}
        subtitle={t("settings.title")}
      />
      <ScrollView>
        <PaddingLayout style={styles.contentContainer}>
          <View style={styles.formContainer}>
            {/* Выбор шаблона */}
            <Select
              label={t("settings.assistantTemplate.title")}
              placeholder={t("settings.assistantTemplate.placeholder")}
              options={templateOptions}
              value={selectedTemplate}
              onValueChange={handleTemplateSelect}
              backgroundColor={colors.secondary}
            />

            <Separator />

            {/* Основные поля формы */}
            {assistantFormFields.map((field) => (
              <FormField
                key={field.key}
                field={field}
                value={values[field.key as keyof typeof values]}
                error={errors[field.key]}
                onChange={handleChange}
              />
            ))}

            {/* Ошибка общая */}
            {errors.general && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.general}
              </Text>
            )}
          </View>

          <View style={styles.saveButtonContainer}>
            <Button
              backgroundColor={
                theme === "dark" ? colors.accent : colors.primary
              }
              textColor={theme === "dark" ? colors.primary : colors.white}
              onPress={handleSaveWithConfirmation}
              isLoading={isSaving}
              disabled={isSaving}
            >
              {t("shared.actions.save")}
            </Button>
          </View>
        </PaddingLayout>
      </ScrollView>
    </Layout>
  );
};

export default SettingsAssistantScreen;
