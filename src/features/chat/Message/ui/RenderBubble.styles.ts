import { FONTS } from "@/src/shared/const";
import { Theme, ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors, theme: Theme) =>
  StyleSheet.create({
    wrapperRight: {
      backgroundColor: theme === "light" ? colors.primary : colors.accent,
      borderBottomRightRadius: 0,
      borderRadius: 25,
      padding: 4,
      borderWidth: 1,
      borderColor: theme === "light" ? colors.primary : colors.accent,
    },
    wrapperLeft: {
      backgroundColor: theme === "light" ? colors.white : colors.alternate,
      borderBottomLeftRadius: 0,
      borderRadius: 25,
      padding: 4,
      borderWidth: 1,
      borderColor: colors.alternate,
    },
    textRight: {
      color: colors.contrastReverse,
      fontFamily: FONTS.regular,
    },
    textLeft: {
      color: colors.contrast,
      fontFamily: FONTS.regular,
    },
    timeRight: {
      color: colors.contrastReverse + 70,
    },
    timeLeft: {
      color: colors.contrast + 50,
    },
  });
