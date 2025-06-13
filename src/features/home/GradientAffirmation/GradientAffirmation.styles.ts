import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";

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
