import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors, theme: "dark" | "light") =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme === "dark" ? colors.secondary : colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    content: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    recordingIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    recordingDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.error,
      opacity: 0.3,
    },
    recordingDotActive: {
      opacity: 1,
      // Анимация пульсации будет добавлена через Animated API
    },
    timeText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? colors.contrast : colors.primary,
      fontVariant: ["tabular-nums"], // Моноширинные цифры
    },
    controls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    controlButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme === "dark" ? colors.primary : colors.light,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme === "dark" ? colors.alternate : colors.secondary,
    },
    stopButton: {
      backgroundColor: colors.error + "20", // Полупрозрачный красный фон
      borderColor: colors.error,
    },
    controlButtonText: {
      fontSize: 20,
    },
    errorContainer: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      textAlign: "center",
    },
  });
