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
  BottomSheetScrollView,
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
  TextWithIcon,
} from "@/src/shared/ui";
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";

const OnboardingStepsView = () => {
  const t = useT();
  const { setBottomSheetVisible, navigateToFlow, setNavigation } =
    useBottomSheetStore();
  const { colors, theme } = useThemeStore();

  const {
    currentStep,
    isCompleted,
    isRewardClaimed,
    setCurrentStep,
    completeStep,
    completeOnboarding,
    claimReward,
    resetOnboarding,
  } = useOnboardingStore();

  // Обработчик закрытия
  const handleClose = useCallback(() => {
    setBottomSheetVisible(false);
  }, [setBottomSheetVisible]);

  useEffect(() => {
    setNavigation(false, "");
  }, [setNavigation]);

  const maxStep = ONBOARDING_STEP_KEYS.length - 1;

  const handleNextStep = () => {
    if (!currentStep) {
      setCurrentStep(0);
      setLocalStep(0);
      return;
    }

    if (localStep < maxStep && localStep + 1 <= currentStep) {
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

  const [localStep, setLocalStep] = useState(currentStep ?? -1);

  const isMeetStep = localStep === -1;
  const isDontHaveNext = localStep === currentStep;
  const isSteps = localStep >= 0 && localStep <= maxStep;

  // useEffect(() => {
  //   setCurrentStep(4);
  // }, []);

  console.log({ localStep, currentStep, isCompleted, isRewardClaimed });

  const stepsConfig = {
    "0": {
      description:
        "Для начала создайте дневник и сделайте первую запись. 📔\nКаждая новая запись формирует ваш личный портрет. Чем больше деталей — тем точнее и полезнее будут инсайты. ✨",
      instruction: "Как создать дневник?",
      type: "journals",
      checklist: [
        {
          text: "Создайте дневник",
          checked: true,
        },
        {
          text: "Сделайте первую запись",
          checked: false,
        },
      ],
    },
    "1": {
      description:
        "Теперь создайте чат и напишите первое сообщение. 💬\nС каждым сообщением приложение будет лучше понимать вас — и поможет вам глубже понять себя. ✨",
      instruction: "Как создать чат?",
      type: "chats",
      checklist: [
        {
          text: "Создайте чат",
          checked: true,
        },
        {
          text: "Напишите первое сообщение",
          checked: false,
        },
      ],
    },
    "2": {
      description:
        "Теперь создайте свою первую цель. 🎯\nВы можете добавить шаги вручную — или воспользоваться умной генерацией, чтобы приложение помогло вам сформировать план достижения. ✨",
      instruction: "Как создать цель?",
      type: "goals",
      checklist: [
        {
          text: "Создайте цель",
          checked: true,
        },
      ],
    },
    "3": {
      description:
        "Теперь создайте своё первое саммари. 🪞\nВы можете подвести итоги за выбранный период или по конкретным темам. Приложение поможет увидеть связи и осознать, как вы меняетесь. ✨",
      instruction: "Как создать саммари?",
      type: "summaries",
      checklist: [
        {
          text: "Создайте саммари",
          checked: true,
        },
      ],
    },
    "4": {
      description:
        "Перейдите к анализу данных. 📊\nВ разделе «Обзор данных» вы увидите, какие темы занимают больше всего места в вашей жизни. А в «Карте взаимосвязей» — как они связаны между собой. ✨",
      instruction: "Как проанализировать данные?",
      type: "analyze",
      checklist: [
        {
          text: 'Откройте "Обзор данных"',
          checked: true,
        },
        {
          text: 'Откройте "Карту взаимосвязей"',
          checked: true,
        },
      ],
    },
  };

  const instructionText = `1. Выйдите в главное меню\n2. Нажмите на [ICON_COMPONENT] в панели навигации снизу\n3. Выберите тип "${t(
    `entities.${stepsConfig[localStep]?.type}.singular`
  )}" и заполните поля\n4. Нажмите "${t("shared.actions.create")}"`;

  const analyzeInstructionText = `1. Выйдите в главное меню\n2. Нажмите на [ICON_COMPONENT] в панели навигации снизу\n3. Вы попали на страницу "Обзор"\n4. Выберите инструмент анализа`;

  const meetingText =
    "Привет, это Reflexity - твой лайф-менеджер с персонализированным ИИ-ассистентом.\n\nПознакомься с функциями приложения и получи награду - неделю подписки Plus.";

  const rewardText =
    "Вы завершили онбординг! Пожалуйста, получите свою награду.";

  const thankYouText = "Спасибо за прохождение онбординга!";

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        isBorderGap={false}
        title={t("onboarding.title")}
        onBack={isMeetStep ? undefined : handlePreviousStep}
        onNext={isDontHaveNext || isMeetStep ? undefined : handleNextStep}
        // onClose={isMeetStep ? handleClose : undefined}
      />
      <BottomSheetScrollView
        customMaxHeight={WINDOW_HEIGHT - 270}
        additionalHeight={225}
      >
        {isMeetStep && (
          <PaddingLayout style={{ gap: 12, paddingVertical: 18 }}>
            <Text
              size="normal"
              color={colors.contrast}
              style={{ textAlign: "center" }}
            >
              {meetingText}
            </Text>
          </PaddingLayout>
        )}
        {isSteps && (
          <>
            <OnboardingCounter
              steps={ONBOARDING_STEP_KEYS.map((key) => t(key))}
              currentStep={localStep}
              secondaryColor={
                theme === "dark" ? colors.light : colors.alternate
              }
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
                {stepsConfig[localStep]?.description}
              </MarkdownEmojiText>
            </PaddingLayout>
            <Divider color={colors.alternate} style={{ marginVertical: 0 }} />
            <PaddingLayout style={{ gap: 12, paddingVertical: 18 }}>
              <CheckboxList style={{ paddingVertical: 0, gap: 12 }}>
                {stepsConfig[localStep]?.checklist.map((item, index) => (
                  <CheckBox
                    text={item.text}
                    checked={item.checked}
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
                  {stepsConfig[localStep]?.instruction}
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
                <TextWithIcon
                  text={
                    stepsConfig[localStep]?.type === "analyze"
                      ? analyzeInstructionText
                      : instructionText
                  }
                  element={
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
                    )
                  }
                />
              )}
            </PaddingLayout>
          </>
        )}
        {isCompleted && (
          <PaddingLayout>
            {isRewardClaimed ? (
              <Text
                size="normal"
                color={colors.contrast}
                style={{ textAlign: "center" }}
              >
                {thankYouText}
              </Text>
            ) : (
              <Text
                size="normal"
                color={colors.contrast}
                style={{ textAlign: "center" }}
              >
                {rewardText}
              </Text>
            )}
          </PaddingLayout>
        )}
      </BottomSheetScrollView>

      <BottomSheetFooter isBorderGap={false}>
        <Button
          backgroundColor={theme === "dark" ? colors.accent : colors.primary}
          textColor={theme === "dark" ? colors.primary : colors.white}
          onPress={isMeetStep ? handleNextStep : handleClose}
          isLoading={false}
          disabled={false}
        >
          {t(
            isMeetStep
              ? "shared.actions.continue"
              : "onboarding.inMainMenuButton"
          )}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default OnboardingStepsView;
