import { Theme, ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors, theme: Theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 60,
      right: -11,
      zIndex: 1000,
    },
    popup: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 30,
      borderWidth: 1,
      width: 60,
      gap: 10,
      padding: 10,
      borderColor: colors.alternate,
      backgroundColor: theme === "light" ? colors.white : colors.secondary,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        theme === "dark" ? colors.accent + 25 : colors.primary + 10,
    },
  });
