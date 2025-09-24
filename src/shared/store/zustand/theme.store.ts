import { PALLETE_COLORS } from "@/src/shared/const";
import { ThemeColors } from "@/src/shared/model/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ThemeState {
  theme: "dark" | "light";
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
  isBackgroundImage?: boolean;
  setIsBackgroundImage: (isBackgroundImage: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist<ThemeState>(
    (set) => ({
      theme: "dark",
      colors: PALLETE_COLORS.dark,
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "dark" ? "light" : "dark";
          return {
            theme: newTheme,
            colors: PALLETE_COLORS[newTheme],
          };
        }),
      setTheme: (theme) =>
        set({
          theme,
          colors: PALLETE_COLORS[theme],
        }),
      isBackgroundImage: false,
      setIsBackgroundImage: (isBackgroundImage) => set({ isBackgroundImage }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        ({
          theme: state.theme,
          colors: state.colors,
        } as ThemeState),
    }
  )
);
