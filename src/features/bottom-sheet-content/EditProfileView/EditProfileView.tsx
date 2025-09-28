import { useProfile } from "@/src/entities/auth/hooks/useProfile";
import { useT } from "@/src/shared/lib/hooks";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetScrollView,
  Button,
  PaddingLayout,
} from "@/src/shared/ui";
import { FormField } from "@/src/widgets";
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import { useEditProfileForm } from "./lib/hooks/useEditProfileForm";
import { useProfileFormConfig } from "./lib/hooks/useProfileFormConfig";

interface EditProfileViewProps {
  isStandalone?: boolean;
  onExternalSubmit?: React.MutableRefObject<(() => Promise<boolean>) | null>;
}

const EditProfileView = ({
  isStandalone,
  onExternalSubmit,
}: EditProfileViewProps) => {
  const t = useT();
  const { setBottomSheetVisible, navigateToFlow, setNavigation } =
    useBottomSheetStore();
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
      if (result && !onExternalSubmit) {
        navigateToFlow("common", "success");
      }
    });

  // Обработчик сохранения с подтверждением
  const handleSaveWithConfirmation = useCallback(async (): Promise<boolean> => {
    try {
      await handleSubmit();
      if (onExternalSubmit) return true;
    } catch (error) {
      console.error("Ошибка при сохранении профиля:", error);
      return false;
    }
  }, [handleSubmit]);

  // Передаем функцию submit наружу через ref с помощью useImperativeHandle
  useImperativeHandle(onExternalSubmit, () => handleSaveWithConfirmation, [
    handleSaveWithConfirmation,
  ]);

  // Эффект для сброса формы при изменении конфигурации
  useEffect(() => {
    resetForm();
  }, [formConfig, resetForm]);

  // Обработчик закрытия
  const handleClose = useCallback(() => {
    setBottomSheetVisible(false);
    resetForm();
  }, [setBottomSheetVisible, resetForm]);

  useEffect(() => {
    setNavigation(false, "");
  }, [setNavigation]);

  // Мемоизированный компонент для рендера полей формы
  const RenderContent = useMemo(
    () => (
      <>
        {formConfig.fields.map((field) => (
          <FormField
            key={field.key}
            field={field}
            value={values[field.key]}
            error={errors[field.key]}
            onChange={handleChange}
          />
        ))}
      </>
    ),
    [formConfig.fields, values, errors, handleChange]
  );

  if (isStandalone) {
    return RenderContent;
  }

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        isBorderGap={false}
        title={formConfig.title}
        onClose={handleClose}
      />
      <BottomSheetScrollView
        customMaxHeight={WINDOW_HEIGHT - 270}
        additionalHeight={225}
      >
        <PaddingLayout style={{ gap: 12, paddingVertical: 18 }}>
          {RenderContent}
        </PaddingLayout>
      </BottomSheetScrollView>
      {!onExternalSubmit && (
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
      )}
    </BottomSheetBox>
  );
};

export default EditProfileView;
