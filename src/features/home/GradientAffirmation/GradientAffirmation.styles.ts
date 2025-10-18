import { Theme, ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors, theme: Theme) =>
  StyleSheet.create({
    globalBox: {
      borderRadius: 18,
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      gap: 10,
      borderWidth: 1,
      borderColor: theme === "light" ? "#f2f2f2" : "#cfcfcf",
    },
  });
