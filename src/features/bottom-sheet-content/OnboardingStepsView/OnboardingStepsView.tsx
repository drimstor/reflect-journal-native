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
import React, { useCallback, useState } from "react";
import { Pressable, View } from "react-native";

const OnboardingStepsView = () => {
  const t = useT();
  const { setBottomSheetVisible } = useBottomSheetStore();
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

  const maxStep = ONBOARDING_STEP_KEYS.length - 1;

  const handleNextStep = () => {
    if (!currentStep || currentStep === -1) {
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
  //   setCurrentStep(-1);
  // }, []);

  console.log({ localStep, currentStep, isCompleted, isRewardClaimed });

  const meetingText =
    "Познакомьтесь с функциями приложения и получите награду — неделю подписки **Plus** бесплатно!";

  const stepsConfig = {
    "0": {
      description:
        "Создайте **Дневник** и сделайте первую запись. 📔\nКаждая запись формирует ваш личный портрет — чем больше деталей, тем точнее инсайты. ✨",
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
        "Создайте **Чат** и напишите первое сообщение. 💬\nС каждым сообщением приложение узнаёт вас лучше и помогает вам глубже понять себя. ✨",
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
        "Создайте первую **Цель**. 🎯\nДобавьте шаги вручную или используйте умную генерацию — приложение поможет составить план достижения. ✨",
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
        "Создайте первое **Саммари**.🪞\nПодведите итоги за период или по конкретным темам — приложение поможет увидеть связи и понять, как вы меняетесь.✨",
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
        "Перейдите к анализу данных. 📊\nВ разделе **Обзор данных** вы увидите, какие темы важнее всего в вашей жизни.\nА в **Карте взаимосвязей** — как они связаны между собой. ✨",
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

  const instructionText = `1. Выйдите в главное меню\n2. Нажмите на [ICON_COMPONENT] в панели навигации снизу\n3. Выберите тип **${t(
    `entities.${stepsConfig[localStep]?.type}.singular`
  )}** и заполните поля\n4. Нажмите **${t("shared.actions.create")}**`;

  const analyzeInstructionText = `1. Выйдите в главное меню\n2. Нажмите на [ICON_COMPONENT] в панели навигации снизу\n3. Вы попали на страницу **Обзор**\n4. Выберите инструмент анализа`;

  const rewardText =
    "Поздравляем! Вы завершили онбординг!\n\nЗаберите свою награду!";

  const thankYouText =
    "Вы освоили основной функционал! 🎉\n\nТеперь начинается самое интересное. Каждая запись — это шаг к пониманию себя. Приложение становится вашим внимательным зеркалом, отражая то, что вы не видели раньше. Будьте открыты — и откройте себя заново. ✨";

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        isBorderGap={false}
        title={t("onboarding.title")}
        onBack={isMeetStep ? undefined : handlePreviousStep}
        onNext={isDontHaveNext || isMeetStep ? undefined : handleNextStep}
        // onClose={isMeetStep ? handleClose : undefined}
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
              {stepsConfig[localStep]?.description}
            </MarkdownEmojiText>
          </PaddingLayout>
          <Divider color={colors.alternate} style={{ marginVertical: 0 }} />
          <PaddingLayout style={{ gap: 12, paddingVertical: 18 }}>
            <CheckboxList style={{ paddingVertical: 0, gap: 12 }}>
              {stepsConfig[localStep]?.checklist.map((item, index) => (
                <CheckBox text={item.text} checked={item.checked} key={index} />
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

      <BottomSheetFooter isBorderGap={false}>
        {isCompleted && !isRewardClaimed && (
          <Button
            backgroundColor={colors.alternate}
            onPress={() => {}}
            isLoading={false}
            disabled={false}
          >
            {t("shared.actions.takeReward")}
          </Button>
        )}
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
