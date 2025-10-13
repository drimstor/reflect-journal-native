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

// Интерфейс для пункта чек-листа
export interface ChecklistItem {
  id: string;
  completed: boolean;
}

// Структура чек-листов для всех шагов
const initialChecklists: { [stepIndex: number]: ChecklistItem[] } = {
  0: [
    { id: "journal_created", completed: false },
    { id: "journal_entry_created", completed: false },
  ],
  1: [
    { id: "chat_created", completed: false },
    { id: "message_sent", completed: false },
  ],
  2: [{ id: "goal_created", completed: false }],
  3: [{ id: "summary_created", completed: false }],
  4: [
    { id: "overview_visited", completed: false },
    { id: "relationship_map_visited", completed: false },
  ],
};

interface OnboardingState {
  // Текущий активный шаг (0-4)
  currentStep?: number;
  // Завершен ли весь онбординг
  isCompleted: boolean;
  // Забрали ли награду
  isRewardClaimed: boolean;
  // Чек-листы для каждого шага
  checklists: { [stepIndex: number]: ChecklistItem[] };

  // Действия
  setCurrentStep: (step: number | undefined) => void;
  completeStep: () => void;
  completeOnboarding: () => void;
  claimReward: () => void;
  resetOnboarding: () => void;
  // Новые методы для работы с чек-листами
  updateChecklistItem: (stepIndex: number, itemId: string) => void;
  isStepCompleted: (stepIndex: number) => boolean;
}

const initialState = {
  currentStep: -1,
  isCompleted: false,
  isRewardClaimed: false,
  checklists: initialChecklists,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist<OnboardingState>(
    (set, get) => ({
      ...initialState,

      // Установить текущий шаг
      setCurrentStep: (step: number | undefined) => {
        set({ currentStep: step });
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

      // Обновить конкретный пункт чек-листа
      updateChecklistItem: (stepIndex: number, itemId: string) => {
        set((state) => {
          const newChecklists = { ...state.checklists };
          const stepChecklist = [...(newChecklists[stepIndex] || [])];
          const itemIndex = stepChecklist.findIndex(
            (item) => item.id === itemId
          );

          // Если пункт найден и еще не выполнен
          if (itemIndex !== -1 && !stepChecklist[itemIndex].completed) {
            stepChecklist[itemIndex] = {
              ...stepChecklist[itemIndex],
              completed: true,
            };
            newChecklists[stepIndex] = stepChecklist;

            // Проверяем, все ли пункты всех шагов выполнены
            const allStepsCompleted = Object.values(newChecklists).every(
              (checklist) => checklist.every((item) => item.completed)
            );

            if (allStepsCompleted) {
              return {
                checklists: newChecklists,
                isCompleted: true,
              };
            }

            return { checklists: newChecklists };
          }

          return state;
        });
      },

      // Проверить, выполнен ли шаг полностью
      isStepCompleted: (stepIndex: number) => {
        const stepChecklist = get().checklists[stepIndex];
        if (!stepChecklist) return false;
        return stepChecklist.every((item) => item.completed);
      },
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
