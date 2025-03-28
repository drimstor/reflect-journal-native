import { StyleSheet } from "react-native";
import { Theme, ThemeColors } from "@/src/shared/model/types";
import { FONTS } from "@/src/shared/const";

export const createStyles = (colors: ThemeColors, theme: Theme) =>
  StyleSheet.create({
    wrapperRight: {
      backgroundColor: theme === "light" ? colors.primary : colors.purple,
      borderBottomRightRadius: 0,
      borderRadius: 25,
      padding: 4,
      borderWidth: 1,
      borderColor: theme === "light" ? colors.primary : colors.purple,
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
