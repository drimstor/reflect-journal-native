import { Theme, ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";
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
