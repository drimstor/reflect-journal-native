import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppearanceSettings {
  isEmoji: boolean;
}

interface SettingsState {
  appearance: AppearanceSettings;
  updateSettings: (settings: Partial<SettingsState>) => void;
  resetSettings: () => void;
}

const initialState = {
  appearance: {
    isEmoji: true,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist<SettingsState>(
    (set) => ({
      ...initialState,
      // Универсальное обновление любых настроек
      updateSettings: (newSettings) =>
        set((state) => ({
          ...state,
          ...newSettings,
          // Глубокое слияние для вложенных объектов
          ...(newSettings.appearance && {
            appearance: {
              ...state.appearance,
              ...newSettings.appearance,
            },
          }),
        })),
      // Сброс всех настроек к значениям по умолчанию
      resetSettings: () => set(initialState),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
