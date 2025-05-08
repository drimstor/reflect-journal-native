import { Theme } from "@/src/shared/model/types";
import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors, theme: Theme) =>
  StyleSheet.create({
    globalBox: {
      width: 120,
      height: 57,
      backgroundColor: theme === "light" ? colors.white : colors.alternate,
      borderBottomLeftRadius: 0,
      borderRadius: 25,
    },
    loaderBox: {
      marginTop: -18,
      marginLeft: -30,
    },
  });
