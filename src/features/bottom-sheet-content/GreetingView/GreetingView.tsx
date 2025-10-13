import { useT } from "@/src/shared/lib/hooks";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  Button,
  Info,
  MarkdownEmojiText,
  PaddingLayout,
  TextWithIcon,
} from "@/src/shared/ui";
import { Image } from "expo-image";
import React, { useCallback, useState } from "react";

const OnboardingStepsView = () => {
  const t = useT();
  const { setBottomSheetVisible } = useBottomSheetStore();
  const { colors, theme } = useThemeStore();

  // Обработчик закрытия
  const handleClose = useCallback(() => {
    setBottomSheetVisible(false);
  }, [setBottomSheetVisible]);

  const stepsConfig = [
    {
      text: t("onboarding.greetingSteps.0"),
      elements: [
        {
          placeholder: "[APP_LOGO]",
          elementSize: 15,
          element: (
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 20, height: 20 }}
            />
          ),
        },
        {
          placeholder: "[INFO]",
          elementSize: 13,
          element: (
            <Info gap={0} tooltipText={t("onboarding.greetingStepsInfo")} />
          ),
        },
      ],
    },
    {
      text: t("onboarding.greetingSteps.1"),
      elements: [],
    },
  ];

  const [localStep, setLocalStep] = useState(0);

  const maxStep = stepsConfig.length - 1;

  const handleNextStep = () => {
    setLocalStep(localStep + 1);
  };

  const handlePreviousStep = () => {
    setLocalStep(localStep - 1);
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        isBorderGap={false}
        title={t("onboarding.meeting")}
        onBack={localStep > 0 ? handlePreviousStep : undefined}
      />
      <PaddingLayout style={{ paddingVertical: 20 }}>
        {localStep === 0 && (
          <TextWithIcon
            text={stepsConfig[localStep].text}
            elements={stepsConfig[localStep].elements}
          />
        )}
        {localStep === 1 && (
          <MarkdownEmojiText
            color={colors.contrast}
            elements={stepsConfig[localStep].elements}
          >
            {stepsConfig[localStep].text}
          </MarkdownEmojiText>
        )}
      </PaddingLayout>

      <BottomSheetFooter isBorderGap={false}>
        <Button
          backgroundColor={theme === "dark" ? colors.accent : colors.primary}
          textColor={theme === "dark" ? colors.primary : colors.white}
          onPress={localStep !== maxStep ? handleNextStep : handleClose}
        >
          {t(
            localStep !== maxStep
              ? "shared.actions.continue"
              : "onboarding.actions.toLibrary"
          )}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default OnboardingStepsView;
