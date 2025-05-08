import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    dateRangeContainer: {
      marginBottom: 16,
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.light,
    },
    dateRangeText: {
      fontSize: 16,
      textAlign: "center",
    },
  });
