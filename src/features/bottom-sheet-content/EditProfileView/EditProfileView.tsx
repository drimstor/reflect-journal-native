import { useProfile } from "@/src/entities/auth/hooks/useProfile";
import { useT } from "@/src/shared/lib/hooks";
import {
  useBottomSheetStore,
  useDeviceStore,
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
import { useEditProfileForm } from "./lib/hooks/useEditProfileForm";
import { useProfileFormConfig } from "./lib/hooks/useProfileFormConfig";

const EditProfileView = () => {
  const t = useT();
  const { window } = useDeviceStore();
  const { setBottomSheetVisible, navigateToFlow } = useBottomSheetStore();
  const { colors, theme } = useThemeStore();

  // Хук для работы с профилем пользователя
  const {
    userData: profileData,
    handleUpdateProfile,
    isUpdateLoading,
  } = useProfile();

  // Получаем конфигурацию формы
  const formConfig = useProfileFormConfig(profileData);

  // Инициализируем форму
  const { values, errors, handleChange, handleSubmit, resetForm } =
    useEditProfileForm(formConfig, async (formData) => {
      const result = await handleUpdateProfile(formData);
      if (result) {
        navigateToFlow("common", "success");
      }
    });

  // Эффект для сброса формы при изменении конфигурации
  useEffect(() => {
    resetForm();
  }, [formConfig, resetForm]);

  // Обработчик закрытия
  const handleClose = () => {
    setBottomSheetVisible(false);
    resetForm();
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader title={formConfig.title} onClose={handleClose} />
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
          isLoading={isUpdateLoading}
          disabled={isUpdateLoading}
        >
          {t("shared.actions.save")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default EditProfileView;
