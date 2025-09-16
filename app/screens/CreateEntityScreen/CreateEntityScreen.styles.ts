import { ThemeColors } from "@/src/shared/model/types";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    globalBox: {
      backgroundColor: colors.secondary,
      flex: 1,
      paddingTop: 18,
    },
    globalContentBox: {
      paddingBottom: 370,
    },
    snackbarsContainer: {
      position: "absolute",
      top: -12,
      left: 0,
      right: 0,
      zIndex: 1000,
    },
  });
};
