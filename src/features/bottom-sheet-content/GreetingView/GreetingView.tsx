import { useT } from "@/src/shared/lib/hooks";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  Button,
  Info,
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
      text: "Reflexity [APP_LOGO] — ваш персональный ИИ-лайф-менеджер.\n\nДля примера, мы наполнили приложение данными от лица человека, который ищет новую работу[INFO].\n\nИзучите, как эффективно вести записи в приложении.",
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
            <Info
              gap={0}
              tooltipText="Вы можете очистить все данные в настройках"
            />
          ),
        },
      ],
    },
    {
      text: "В Библиотеке хранятся все ваши записи: Дневники, Чаты, Цели и Саммари. Они могут быть связаны между собой.\n\nНа примере поиска работы:\n• Создайте Цель — «Найти работу мечты»\n• Фиксируйте прогресс в Дневнике\n• Обсуждайте детали в Чате\n• Проводите ретроспективы в Саммари",
      elements: [],
    },
  ];

  const [localStep, setLocalStep] = useState(0);

  const maxStep = stepsConfig.length - 1;

  const handleNextStep = () => {
    if (localStep < maxStep && localStep + 1 <= maxStep) {
      setLocalStep(localStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (localStep > 0) {
      setLocalStep(localStep - 1);
    }
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        isBorderGap={false}
        title={t("onboarding.meeting")}
        onBack={localStep > 0 ? handlePreviousStep : undefined}
        // onNext={isDontHaveNext || localStep >= 0 ? undefined : handleNextStep}
        // onClose={isMeetStep ? handleClose : undefined}
      />
      <PaddingLayout style={{ gap: 12, paddingVertical: 20 }}>
        <TextWithIcon
          text={stepsConfig[localStep].text}
          elements={stepsConfig[localStep].elements}
        />
      </PaddingLayout>

      <BottomSheetFooter isBorderGap={false}>
        <Button
          backgroundColor={theme === "dark" ? colors.accent : colors.primary}
          textColor={theme === "dark" ? colors.primary : colors.white}
          onPress={localStep !== maxStep ? handleNextStep : handleClose}
          isLoading={false}
          disabled={false}
        >
          {t(
            localStep !== maxStep
              ? "shared.actions.continue"
              : "onboarding.inLibraryButton"
          )}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default OnboardingStepsView;
