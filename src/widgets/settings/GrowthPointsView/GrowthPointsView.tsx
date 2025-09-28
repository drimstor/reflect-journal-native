import { useT } from "@/src/shared/lib/hooks";
import { addSnackbar, useAppDispatch, useThemeStore } from "@/src/shared/store";
import { AnimatedAppearance, Button, Loader, Separator } from "@/src/shared/ui";
import { FormField } from "@/src/widgets";
import {
  Fragment,
  RefObject,
  useCallback,
  useImperativeHandle,
  useMemo,
} from "react";
import { View } from "react-native";
import { createGrowthFormFields } from "./const/growthConfig";
import { useGrowthForm } from "./lib/hooks/useGrowthForm";

interface GrowthPointsViewProps {
  chipColor?: string;
  onExternalSubmit?: RefObject<(() => Promise<boolean>) | null>;
}

const GrowthPointsView = ({
  chipColor,
  onExternalSubmit,
}: GrowthPointsViewProps) => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const dispatch = useAppDispatch();

  const growthFormFields = useMemo(
    () => createGrowthFormFields(t, chipColor),
    [t, chipColor]
  );

  // Используем хук для работы с формой роста
  const { values, isLoading, isSaving, handleChange, handleSubmit } =
    useGrowthForm();

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
      {growthFormFields.map((field, index) => (
        <Fragment key={field.key}>
          <FormField
            field={field}
            value={values[field.key as keyof typeof values]}
            onChange={handleChange}
          />
          {index !== growthFormFields.length - 1 && <Separator />}
        </Fragment>
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

export default GrowthPointsView;
