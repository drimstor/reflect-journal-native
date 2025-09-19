import { PALLETE_COLORS } from "@/src/shared/const";
import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    buttonWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 6,
      backgroundColor: colors.primary,
    },
    disabled: {
      opacity: 0.5,
      color: PALLETE_COLORS.light.white,
    },
    text: {
      marginTop: -2,
      textAlign: "center",
    },
    loaderBox: {
      marginTop: -10,
      maxHeight: 40,
    },
  });

export const sizeStyles = StyleSheet.create({
  medium: {
    minHeight: 52,
    maxHeight: 52,
  },
  small: {
    minHeight: 40,
    maxHeight: 40,
  },
});
