import { useT, useToggle } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import { AnimatedAppearance, OnboardingCounter, Text } from "@/src/shared/ui";
import { Header } from "@/src/widgets";
import { useEffect } from "react";
import { createStyles } from "../../AuthScreen.styles";
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
  const styles = createStyles(colors);
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
      <AnimatedAppearance isVisible={isWelcomeVisible} duration={2500}>
        <Text font="thin" color={colors.contrast} style={styles.welcomeText}>
          {t("shared.actions.welcome")}
        </Text>
      </AnimatedAppearance>

      {/* Блок заголовка и счетчика онбординга */}
      <AnimatedAppearance
        delay={0}
        duration={750}
        isVisible={!!variant && isVisible && !isWelcomeVisible}
      >
        <>
          <Header
            title={t("auth.onboarding.title")}
            subtitle={t("auth.onboarding.subtitle")}
          />
          <OnboardingCounter
            steps={onboardingVariantsTranslated}
            currentStep={onboardingVariants.indexOf(variant)}
            style={styles.onboardingCounter}
          />
        </>
      </AnimatedAppearance>
    </>
  );
};
