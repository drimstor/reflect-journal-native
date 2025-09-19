import { useEditAnyEntities } from "@/src/entities/common/lib/hooks/useEditAnyEntities";
import { useT } from "@/src/shared/lib/hooks";
import {
  useBottomSheetStore,
  useDeviceStore,
  useFiltersStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetScrollView,
  Button,
  PaddingLayout,
} from "@/src/shared/ui";
import { FormField } from "@/src/widgets";
import { useEffect } from "react";
import { useEditForm } from "./lib/hooks/useEditForm";
import { useEditFormConfig } from "./lib/hooks/useEditFormConfig";

const EditEntityView = () => {
  const t = useT();
  const { window } = useDeviceStore();
  const { navigateToFlow, flowData, setBottomSheetVisible } =
    useBottomSheetStore();
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

  const handleClose = () => {
    setBottomSheetVisible(false);
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        title={formConfig.title}
        onClose={handleClose}
        onBack={handleBack}
        isBorderGap={false}
      />
      <BottomSheetScrollView
        customMaxHeight={window.height - 270}
        additionalHeight={225}
      >
        <PaddingLayout style={{ gap: 12, paddingVertical: 16 }}>
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
      </BottomSheetScrollView>
      <BottomSheetFooter isBorderGap={false}>
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
