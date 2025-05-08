import {
  Text,
  Button,
  BottomSheetHeader,
  BottomSheetFooter,
  PaddingLayout,
  BottomSheetBox,
  BottomSheetScrollView,
} from "@/src/shared/ui";
import {
  useThemeStore,
  useBottomSheetStore,
  useFiltersStore,
} from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { useEditAnyEntities } from "@/src/entities/common/lib/hooks/useEditAnyEntities";
import { useEditFormConfig } from "./lib/hooks/useEditFormConfig";
import { useEditForm } from "./lib/hooks/useEditForm";
import { useEffect } from "react";
import { FormField } from "@/src/entities";

const EditEntityView = () => {
  const t = useT();
  const { navigateToFlow, flowData, bottomSheetHeight } = useBottomSheetStore();
  const { colors, theme } = useThemeStore();
  const { resetFilters } = useFiltersStore();

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
    if (isSuccess) {
      resetFilters();
      navigateToFlow("common", "success");
    }
  }, [isSuccess]);

  // Эффект для сброса формы при изменении конфигурации
  useEffect(() => {
    resetForm();
  }, [formConfig, resetForm]);

  // Обработчик возврата
  const handleBack = () => {
    navigateToFlow("common", "list");
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        title={formConfig.title}
        onClose={handleBack}
        onBack={handleBack}
      />
      <BottomSheetScrollView>
        <PaddingLayout style={{ gap: 12 }}>
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
      </BottomSheetScrollView>
    </BottomSheetBox>
  );
};

export default EditEntityView;
