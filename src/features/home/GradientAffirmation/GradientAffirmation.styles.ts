import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    globalBox: {
      borderRadius: 18,
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      gap: 10,
    },
  });
