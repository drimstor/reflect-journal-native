import {
  Text,
  Button,
  BottomSheetHeader,
  BottomSheetFooter,
  PaddingLayout,
  BottomSheetBox,
} from "@/src/shared/ui";
import { useThemeStore, useBottomSheetStore } from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { useEditAnyEntities } from "@/src/entities/common/lib/hooks/useEditAnyEntities";
import { useEditFormConfig } from "./lib/hooks/useEditFormConfig";
import { useEditForm } from "./lib/hooks/useEditForm";
import { FormField } from "./ui/FormField";
import { useEffect } from "react";

const EditEntityView = () => {
  const t = useT();
  const { navigateToFlow, flowData } = useBottomSheetStore();
  const { colors, theme } = useThemeStore();

  // Получаем хук для редактирования сущности
  const { editEntity, isLoading, isSuccess } = useEditAnyEntities(
    flowData.variant,
    flowData.id
  );

  // Получаем конфигурацию формы в зависимости от типа сущности
  const formConfig = useEditFormConfig(flowData.variant, flowData);

  // Инициализируем форму
  const { values, errors, handleChange, handleSubmit, resetForm } = useEditForm(
    formConfig,
    async (formData) => {
      await editEntity(formData);
    }
  );

  useEffect(() => {
    if (isSuccess) navigateToFlow("main", "success");
  }, [isSuccess]);

  // Эффект для сброса формы при изменении конфигурации
  useEffect(() => {
    resetForm();
  }, [formConfig, resetForm]);

  // Обработчик возврата
  const handleBack = () => {
    navigateToFlow("main", "actionsList");
  };

  return (
    <BottomSheetBox style={{ gap: 4, paddingBottom: 60 }}>
      <BottomSheetHeader
        title={formConfig.title}
        onClose={handleBack}
        onBack={handleBack}
      />
      <PaddingLayout style={{ gap: 16 }}>
        {formConfig.fields.map((field) => (
          <FormField
            key={field.key}
            field={field}
            value={values[field.key]}
            error={errors[field.key]}
            onChange={handleChange}
          />
        ))}
      </PaddingLayout>
      <BottomSheetFooter>
        <Button
          backgroundColor={theme === "dark" ? colors.accent : colors.primary}
          textColor={theme === "dark" ? colors.primary : colors.white}
          onPress={handleSubmit}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {t("shared.actions.save")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default EditEntityView;
