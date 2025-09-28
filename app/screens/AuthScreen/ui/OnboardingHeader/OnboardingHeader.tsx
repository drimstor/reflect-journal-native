import { useT, useToggle } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import { AnimatedAppearance, OnboardingCounter, Text } from "@/src/shared/ui";
import { Header } from "@/src/widgets";
import { useEffect } from "react";
import { Variant } from "../../model/types";

interface OnboardingHeaderProps {
  variant: Variant;
  isWelcomeVisible: boolean;
}

/**
 * Компонент секции онбординга с приветствием и счетчиком шагов
 */
export const OnboardingHeader = ({
  variant,
  isWelcomeVisible,
}: OnboardingHeaderProps) => {
  const t = useT();
  const { colors } = useThemeStore();
  const { value: isVisible, toggle: toggleVisible } = useToggle(false);

  useEffect(() => {
    toggleVisible();
  }, []);

  // Конфигурация шагов онбординга - инкапсулирована в компоненте
  const onboardingVariants = ["profile", "growthPoints", "assistant"];
  const onboardingVariantsTranslated = [
    t("auth.onboarding.profile"),
    t("auth.onboarding.growthPoints"),
    t("auth.onboarding.assistant"),
  ];

  return (
    <>
      {/* Блок приветствия */}
      <AnimatedAppearance isVisible={isWelcomeVisible} duration={2000}>
        <Text
          font="thin"
          color={colors.contrast}
          style={{
            textAlign: "center",
            paddingTop: 25,
            fontSize: 28,
            position: "absolute",
            top: 40,
            left: 0,
            right: 0,
            zIndex: 1,
            height: 60,
          }}
        >
          {t("shared.actions.welcome")}
        </Text>
      </AnimatedAppearance>

      {/* Блок заголовка и счетчика онбординга */}
      <AnimatedAppearance
        delay={0}
        duration={700}
        isVisible={isVisible && !isWelcomeVisible}
      >
        <>
          <Header
            title={t("auth.onboarding.title")}
            subtitle={t("auth.onboarding.subtitle")}
          />
          <OnboardingCounter
            steps={onboardingVariantsTranslated}
            currentStep={onboardingVariants.indexOf(variant)}
            style={{
              marginTop: 10,
              maxWidth: 350,
              alignSelf: "center",
            }}
          />
        </>
      </AnimatedAppearance>
    </>
  );
};
