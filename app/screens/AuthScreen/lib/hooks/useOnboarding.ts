import { PATHS } from "@/src/shared/const";
import { usePrefetch, useToggle } from "@/src/shared/lib/hooks";
import { NavigationProps } from "@/src/shared/model/types";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { Variant } from "../../model/types";

interface UseOnboardingProps {
  variant: Variant;
  setVariant: (variant: Variant) => void;
  snapToIndex: (index: number) => void;
}

/**
 * Хук для управления логикой онбординга пользователя
 */
export const useOnboarding = ({
  variant,
  setVariant,
  snapToIndex,
}: UseOnboardingProps) => {
  const navigation = useNavigation<NavigationProps>();
  const { prefetchJournals } = usePrefetch();

  // Состояния онбординга
  const { value: isWelcomeVisible, toggle: toggleWelcomeVisible } =
    useToggle(false);
  const {
    value: isOnboardingStepsLoading,
    toggle: toggleOnboardingStepsLoading,
  } = useToggle(false);

  // Конфигурация шагов онбординга
  const onboardingVariants = ["profile", "growthPoints", "assistant"];
  const isOnboardingVariant = onboardingVariants.includes(variant);

  // Ref для управления submit текущего активного компонента
  const currentSubmitRef = useRef<(() => Promise<boolean>) | null>(null);

  /**
   * Переход между шагами онбординга
   */
  const handleOnboardingStep = (direction: "next" | "previous") => {
    const currentIndex = onboardingVariants.indexOf(variant);
    const nextIndex = currentIndex + (direction === "next" ? 1 : -1);

    if (nextIndex >= 0 && nextIndex < onboardingVariants.length) {
      setVariant(onboardingVariants[nextIndex] as Variant);
    }
  };

  /**
   * Обработчик кнопки "Продолжить" для форм онбординга
   */
  const handleContinue = async () => {
    if (!currentSubmitRef.current) return;

    toggleOnboardingStepsLoading(true);

    try {
      const success = await currentSubmitRef.current();
      if (success) {
        // Если это последний шаг онбординга
        if (variant === "assistant") {
          toggleWelcomeVisible(true);
          prefetchJournals();

          setTimeout(() => {
            setVariant("");
            snapToIndex(1);
            toggleWelcomeVisible(false);

            setTimeout(() => {
              navigation.navigate(PATHS.MAIN_STACK);
            }, 200);
          }, 2000);
        } else {
          // Переходим к следующему шагу
          handleOnboardingStep("next");
        }
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    } finally {
      toggleOnboardingStepsLoading(false);
    }
  };

  return {
    // Состояния
    isWelcomeVisible,
    isOnboardingStepsLoading,
    isOnboardingVariant,

    // Refs
    currentSubmitRef,

    // Методы
    handleOnboardingStep,
    handleContinue,
    toggleWelcomeVisible,
  };
};
