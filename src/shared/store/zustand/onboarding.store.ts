import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Ключи для шагов онбординга
export const ONBOARDING_STEP_KEYS = [
  "onboarding.steps.create_journal",
  "onboarding.steps.create_chat",
  "onboarding.steps.create_goal",
  "onboarding.steps.create_summary",
  "onboarding.steps.analyze_data",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEP_KEYS)[number];

interface OnboardingState {
  // Текущий активный шаг (0-4)
  currentStep?: number;
  // Завершен ли весь онбординг
  isCompleted: boolean;
  // Забрали ли награду
  isRewardClaimed: boolean;

  // Действия
  setCurrentStep: (step: number) => void;
  completeStep: () => void;
  completeOnboarding: () => void;
  claimReward: () => void;
  resetOnboarding: () => void;
}

const initialState = {
  currentStep: undefined,
  isCompleted: false,
  isRewardClaimed: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist<OnboardingState>(
    (set, get) => ({
      ...initialState,

      // Установить текущий шаг
      setCurrentStep: (step: number) => {
        const maxStep = ONBOARDING_STEP_KEYS.length - 1;
        const validStep = Math.max(0, Math.min(step, maxStep));
        set({ currentStep: validStep });
      },

      // Завершить текущий шаг и перейти к следующему
      completeStep: () => {
        const { currentStep, isCompleted } = get();

        if (isCompleted) return;

        const nextStep = currentStep + 1;
        const isLastStep = nextStep >= ONBOARDING_STEP_KEYS.length;

        set({
          currentStep: isLastStep ? currentStep : nextStep,
          isCompleted: isLastStep,
        });
      },

      // Завершить весь онбординг
      completeOnboarding: () => {
        set({ isCompleted: true });
      },

      // Забрать награду
      claimReward: () => {
        set({ isRewardClaimed: true });
      },

      // Сбросить онбординг
      resetOnboarding: () => {
        set(initialState);
      },
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
