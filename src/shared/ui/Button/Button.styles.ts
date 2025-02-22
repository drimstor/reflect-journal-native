import { StyleSheet } from "react-native";
import { PALLETE_COLORS } from "@/src/shared/const";
import { ThemeColors } from "@/src/shared/model/types";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    buttonWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
    },
    disabled: {
      opacity: 0.5,
      color: PALLETE_COLORS.light.white,
    },
  });

export const sizeStyles = StyleSheet.create({
  medium: {
    minHeight: 52,
    maxHeight: 52,
  },
  small: {
    minHeight: 33,
    maxHeight: 33,
  },
});
