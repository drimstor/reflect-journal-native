import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PALLETE_COLORS } from "@/src/shared/const";
import { ThemeColors } from "@/src/shared/model/types";

interface ThemeState {
  theme: "dark" | "light";
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
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
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
