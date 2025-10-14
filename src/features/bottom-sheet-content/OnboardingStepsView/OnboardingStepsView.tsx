import { useT, useToggle } from "@/src/shared/lib/hooks";
import {
  ONBOARDING_STEP_KEYS,
  useBottomSheetStore,
  useOnboardingStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  ArrowLeftIcon,
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  Button,
  ChartSolidIcon,
  CheckBox,
  CheckboxList,
  Divider,
  MarkdownEmojiText,
  OnboardingCounter,
  PaddingLayout,
  PlusIcon,
  Text,
} from "@/src/shared/ui";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";

const OnboardingStepsView = () => {
  const t = useT();
  const { setBottomSheetVisible } = useBottomSheetStore();
  const { colors, theme } = useThemeStore();

  const {
    currentStep,
    isCompleted,
    isRewardClaimed,
    checklists,
    setCurrentStep,
    completeOnboarding,
    claimReward,
    isStepCompleted,
    resetOnboarding,
  } = useOnboardingStore();

  // Обработчик закрытия
  const handleClose = useCallback(() => {
    setBottomSheetVisible(false);
  }, [setBottomSheetVisible]);

  const maxStep = ONBOARDING_STEP_KEYS.length - 1;

  const handleNextStep = () => {
    if (!currentStep || currentStep === -1) {
      setCurrentStep(0);
      setLocalStep(0);
      return;
    }

    // Навигация по стрелкам с учетом локального 5-го шага
    const maxAllowedStep = isCompleted ? maxStep + 1 : currentStep;
    if (localStep < maxAllowedStep) {
      setLocalStep(localStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (localStep > -1) {
      setLocalStep(localStep - 1);
    }
  };

  const { value: isInstructionVisible, toggle: toggleInstructionVisible } =
    useToggle(false);

  // Инициализация localStep с учетом локального 5-го шага
  const [localStep, setLocalStep] = useState(() => {
    const step = currentStep ?? -1;
    // Если онбординг завершен, добавляем локальный 5-й шаг
    if (isCompleted && step === maxStep) {
      return maxStep + 1;
    }
    return step;
  });

  const isMeetStep = localStep === -1;
  const isSteps = localStep >= 0 && localStep <= maxStep;

  // Локальный 5-й шаг (для награды и благодарности)
  const isLocalFinalStep = localStep === maxStep + 1;

  // Определяем максимальный доступный шаг (с учетом локального 5-го)
  const maxAllowedStep = isCompleted ? maxStep + 1 : currentStep ?? -1;
  const isDontHaveNext = localStep >= maxAllowedStep;

  // Проверяем, выполнен ли текущий шаг
  const isCurrentStepCompleted =
    localStep >= 0 && localStep <= maxStep ? isStepCompleted(localStep) : false;

  // Получаем актуальный чек-лист для текущего шага
  const currentChecklist =
    localStep >= 0 && localStep <= maxStep ? checklists[localStep] || [] : [];

  // Определяем состояния экранов (только для локального 5-го шага)
  const isRewardScreen = isLocalFinalStep && isCompleted && !isRewardClaimed;
  const isThankYouScreen = isLocalFinalStep && isCompleted && isRewardClaimed;

  useEffect(() => {
    // completeOnboarding();
    // claimReward();
    // setCurrentStep(-1);
  }, []);

  // Типы для каждого шага
  const stepsConfig = {
    "0": { type: "journals" },
    "1": { type: "chats" },
    "2": { type: "goals" },
    "3": { type: "summaries" },
    "4": { type: "analyze" },
  };

  // Получение переводов
  const meetingText = t("onboarding.meetingText");

  const getStepDescription = (step: number) =>
    t(`onboarding.stepsView.${step}.description`);

  const getStepInstruction = (step: number) =>
    t(`onboarding.stepsView.${step}.instruction`);

  const instructionText = t("onboarding.stepsView.instructionText")
    .replace(
      "{entityType}",
      t(`entities.${stepsConfig[localStep]?.type}.singular`)
    )
    .replace("{createAction}", t("shared.actions.create"));

  const analyzeInstructionText = t(
    "onboarding.stepsView.analyzeInstructionText"
  );

  const rewardText = t("onboarding.congratulations.rewardText");
  const thankYouText = t("onboarding.congratulations.thankYouText");

  // Конфигурация основной кнопки
  const getButtonConfig = () => {
    // Обработчик нажатия
    const handlePress = () => {
      if (isMeetStep) {
        return handleNextStep();
      }

      if (isRewardScreen) {
        return claimReward();
      }

      if (isThankYouScreen) {
        return handleClose();
      }

      if (isCurrentStepCompleted) {
        const nextStep = localStep + 1;
        if (nextStep <= maxStep) {
          setCurrentStep(nextStep);
          setLocalStep(nextStep);
        } else {
          completeOnboarding();
          setLocalStep(maxStep + 1);
        }
        return;
      }

      handleClose();
    };

    // Текст кнопки
    const getButtonText = () => {
      if (isMeetStep || isCurrentStepCompleted)
        return "shared.actions.continue";
      if (isRewardScreen) return "onboarding.actions.takeReward";
      if (isThankYouScreen) return "onboarding.actions.toMainMenu";
      return "onboarding.actions.toMainMenu";
    };

    return {
      onPress: handlePress,
      text: t(getButtonText()),
      backgroundColor: theme === "dark" ? colors.accent : colors.primary,
      textColor: theme !== "dark" ? colors.white : colors.primary,
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        isBorderGap={false}
        title={t("onboarding.title")}
        onBack={isMeetStep ? undefined : handlePreviousStep}
        onNext={isDontHaveNext || isMeetStep ? undefined : handleNextStep}
      />
      {isMeetStep && (
        <PaddingLayout style={{ gap: 12, paddingVertical: 18 }}>
          <MarkdownEmojiText
            color={colors.contrast}
            style={{ textAlign: "center" }}
          >
            {meetingText}
          </MarkdownEmojiText>
        </PaddingLayout>
      )}
      {isSteps && (
        <>
          <OnboardingCounter
            steps={ONBOARDING_STEP_KEYS.map((key) => t(key))}
            currentStep={localStep}
            secondaryColor={theme === "dark" ? colors.light : colors.alternate}
            style={{
              marginTop: 24,
              marginBottom: 22,
              maxWidth: 400,
              marginHorizontal: "auto",
            }}
          />
          <Divider color={colors.alternate} style={{ marginVertical: 0 }} />
          <PaddingLayout style={{ gap: 12, paddingVertical: 18 }}>
            <MarkdownEmojiText color={colors.contrast}>
              {getStepDescription(localStep)}
            </MarkdownEmojiText>
          </PaddingLayout>
          <Divider color={colors.alternate} style={{ marginVertical: 0 }} />
          <PaddingLayout style={{ gap: 12, paddingVertical: 18 }}>
            <CheckboxList style={{ paddingVertical: 0, gap: 12 }}>
              {currentChecklist.map((item, index) => (
                <CheckBox
                  text={t(`onboarding.checklist.${item.id}`)}
                  checked={item.completed}
                  key={index}
                />
              ))}
            </CheckboxList>
          </PaddingLayout>
          <Divider color={colors.alternate} style={{ marginVertical: 0 }} />
          <PaddingLayout
            style={{ gap: 12, paddingVertical: 18, paddingTop: 15 }}
          >
            <Pressable
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              onPress={() => toggleInstructionVisible()}
            >
              <Text size="normal" font="bold" color={colors.contrast}>
                {getStepInstruction(localStep)}
              </Text>
              <View
                style={{
                  marginTop: 3,
                  transform: [
                    { rotate: isInstructionVisible ? "90deg" : "-90deg" },
                  ],
                }}
              >
                <ArrowLeftIcon color={colors.contrast} size={16} />
              </View>
            </Pressable>
            {isInstructionVisible && (
              <MarkdownEmojiText
                color={colors.contrast}
                elements={[
                  {
                    placeholder: "[ICON_COMPONENT]",
                    element:
                      stepsConfig[localStep]?.type === "analyze" ? (
                        <ChartSolidIcon color={colors.contrast} size={26} />
                      ) : (
                        <View
                          style={{
                            backgroundColor: colors.contrast,
                            borderRadius: 13,
                            marginHorizontal: 2,
                          }}
                        >
                          <PlusIcon color={colors.secondary} size={26} />
                        </View>
                      ),
                  },
                ]}
              >
                {stepsConfig[localStep]?.type === "analyze"
                  ? analyzeInstructionText
                  : instructionText}
              </MarkdownEmojiText>
            )}
          </PaddingLayout>
        </>
      )}

      {/* Экран награды */}
      {isRewardScreen && (
        <PaddingLayout style={{ gap: 12, paddingVertical: 18 }}>
          <MarkdownEmojiText
            color={colors.contrast}
            style={{ textAlign: "center" }}
          >
            {rewardText}
          </MarkdownEmojiText>
        </PaddingLayout>
      )}

      {/* Экран благодарности */}
      {isThankYouScreen && (
        <PaddingLayout style={{ gap: 12, paddingVertical: 18 }}>
          <MarkdownEmojiText
            color={colors.contrast}
            style={{ textAlign: "center" }}
          >
            {thankYouText}
          </MarkdownEmojiText>
        </PaddingLayout>
      )}

      <BottomSheetFooter isBorderGap={false}>
        <Button
          backgroundColor={buttonConfig.backgroundColor}
          textColor={buttonConfig.textColor}
          onPress={buttonConfig.onPress}
          isLoading={false}
          disabled={false}
        >
          {buttonConfig.text}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default OnboardingStepsView;
