import { StyleSheet } from "react-native";
import { PALLETE_COLORS } from "@/src/shared/const/PALLETE_COLORS";
import { ThemeColors } from "@/src/shared/model/types";
import { Theme } from "@/src/shared/model/types";
export const createDotsStyles = (colors: ThemeColors, theme: Theme) =>
  StyleSheet.create({
    dotsContainer: {
      gap: 4,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 5,
      backgroundColor: theme === "dark" ? colors.alternate : "#bfbfbf",
    },
    activeDot: {
      backgroundColor: theme === "dark" ? colors.contrast : colors.primary,
    },
  });
