import { useT, useToggle } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import {
  AnimatedAppearance,
  BottomSheetFooter,
  BottomSheetScrollView,
  Button,
  PaddingLayout,
} from "@/src/shared/ui";
import { AssistantView, GrowthPointsView } from "@/src/widgets";
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";
import { MutableRefObject, useEffect } from "react";
import { View } from "react-native";
import { EditProfileView } from "../../../../../src/features";
import { Variant } from "../../model/types";

interface OnboardingSectionProps {
  variant: Variant;
  isWelcomeVisible: boolean;
  isOnboardingStepsLoading: boolean;
  currentSubmitRef: MutableRefObject<(() => Promise<boolean>) | null>;
  handleContinue: () => Promise<void>;
}

/**
 * Компонент секции онбординга с формами и кнопкой продолжения
 */
export const OnboardingSection = ({
  variant,
  isWelcomeVisible,
  isOnboardingStepsLoading,
  currentSubmitRef,
  handleContinue,
}: OnboardingSectionProps) => {
  const t = useT();
  const { colors, theme } = useThemeStore();

  const { value: isVisible, toggle: toggleVisible } = useToggle(false);

  useEffect(() => {
    toggleVisible();
  }, [isWelcomeVisible]);

  return (
    <AnimatedAppearance isVisible={isVisible} duration={0}>
      <View style={{ marginTop: -20, paddingBottom: 50 }}>
        <BottomSheetScrollView
          additionalHeight={60}
          customMaxHeight={WINDOW_HEIGHT - 390}
          customMinHeight={WINDOW_HEIGHT - 390}
          style={{ marginBottom: -17 }}
        >
          <PaddingLayout style={{ gap: 16, paddingBottom: 30, paddingTop: 18 }}>
            {variant === "profile" && (
              <EditProfileView
                isStandalone
                onExternalSubmit={currentSubmitRef}
              />
            )}
            {variant === "growthPoints" && (
              <GrowthPointsView onExternalSubmit={currentSubmitRef} />
            )}
            {variant === "assistant" && (
              <AssistantView onExternalSubmit={currentSubmitRef} />
            )}
          </PaddingLayout>
        </BottomSheetScrollView>
        <BottomSheetFooter>
          <Button
            isLoading={isOnboardingStepsLoading}
            disabled={isOnboardingStepsLoading}
            backgroundColor={theme === "dark" ? colors.accent : colors.primary}
            textColor={theme === "dark" ? colors.primary : colors.white}
            onPress={handleContinue}
          >
            {variant === "assistant"
              ? t("shared.actions.done")
              : t("shared.actions.continue")}
          </Button>
        </BottomSheetFooter>
      </View>
    </AnimatedAppearance>
  );
};
